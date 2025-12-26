"""
Test suite for production deployment readiness.
Verifies the application can start and respond correctly without a model.
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def test_app_starts_without_model():
    """Test that the application starts without a model loaded."""
    from application import create_app, model_info
    
    app = create_app()
    
    with app.test_client() as client:
        # Test health endpoint
        response = client.get('/api/health')
        assert response.status_code == 200, f"Health check failed: {response.status_code}"
        
        data = response.get_json()
        assert data['status'] == 'ok', "Health status should be 'ok'"
        assert data['model_loaded'] == False, "Model should not be loaded"
        
        print("✓ Health check passed")


def test_tts_returns_503_without_model():
    """Test that TTS returns 503 when no model is loaded."""
    from application import create_app
    
    app = create_app()
    
    with app.test_client() as client:
        response = client.post('/api/tts', json={'text': 'Test text'})
        assert response.status_code == 503, f"Expected 503, got {response.status_code}"
        
        data = response.get_json()
        assert 'error' in data, "Response should contain error"
        assert data.get('code') == 'MODEL_NOT_LOADED', "Error code should be MODEL_NOT_LOADED"
        
        print("✓ TTS correctly returns 503 without model")


def test_status_endpoint():
    """Test the detailed status endpoint."""
    from application import create_app
    
    app = create_app()
    
    with app.test_client() as client:
        response = client.get('/api/status')
        assert response.status_code == 200, f"Status check failed: {response.status_code}"
        
        data = response.get_json()
        assert data['application'] == 'Plattdeutsch TTS', "Application name mismatch"
        assert 'model' in data, "Response should contain model info"
        
        print("✓ Status endpoint passed")


def test_model_info_returns_503_without_model():
    """Test that model info returns 503 when no model is loaded."""
    from application import create_app
    
    app = create_app()
    
    with app.test_client() as client:
        response = client.get('/api/info')
        assert response.status_code == 503, f"Expected 503, got {response.status_code}"
        
        print("✓ Model info correctly returns 503 without model")


def test_admin_endpoints_exist():
    """Test that admin endpoints are accessible (may require auth)."""
    from application import create_app
    
    app = create_app()
    
    with app.test_client() as client:
        # List models (should work without auth in dev mode)
        response = client.get('/api/admin/models')
        # Will be 200 (no auth) or 401 (auth required)
        assert response.status_code in [200, 401], f"Unexpected status: {response.status_code}"
        
        print("✓ Admin endpoints exist")


def run_all_tests():
    """Run all deployment readiness tests."""
    print("\n" + "=" * 60)
    print("DEPLOYMENT READINESS TESTS")
    print("=" * 60 + "\n")
    
    tests = [
        test_app_starts_without_model,
        test_tts_returns_503_without_model,
        test_status_endpoint,
        test_model_info_returns_503_without_model,
        test_admin_endpoints_exist,
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"✗ {test.__name__}: {e}")
            failed += 1
        except Exception as e:
            print(f"✗ {test.__name__}: Unexpected error - {e}")
            failed += 1
    
    print("\n" + "=" * 60)
    print(f"RESULTS: {passed} passed, {failed} failed")
    print("=" * 60 + "\n")
    
    if failed > 0:
        print("❌ DEPLOYMENT NOT READY - Fix failing tests before deploying")
        return False
    else:
        print("✅ DEPLOYMENT READY - All tests passed")
        print("\nThe application can safely start without a model.")
        print("Upload and activate a model via Admin Panel after deployment.")
        return True


if __name__ == '__main__':
    success = run_all_tests()
    sys.exit(0 if success else 1)
