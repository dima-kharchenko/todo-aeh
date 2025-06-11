from django.test import TestCase

from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from http.cookies import SimpleCookie
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import Task


class RegistrationTests(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.user_data = {
            "username": "testuser",
            "password": "testpassword123"
        }

    def test_user_registration_successful(self):
        response = self.client.post(self.register_url, self.user_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, "testuser")

        self.assertIn("access_token", response.cookies)
        self.assertIn("refresh_token", response.cookies)

        access_cookie = response.cookies["access_token"]
        refresh_cookie = response.cookies["refresh_token"]

        self.assertTrue(access_cookie["httponly"])
        self.assertTrue(refresh_cookie["httponly"])

    def test_registration_with_existing_username(self):
        User.objects.create_user(**self.user_data)
        response = self.client.post(self.register_url, self.user_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_registration_with_invalid_data(self):
        bad_data = {
            "username": "",
            "password": "123"
        }
        response = self.client.post(self.register_url, bad_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

class TokenCookiesTest(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
        self.user_data = {
            "username": "testuser",
            "password": "testpassword123"
        }
    def test_jwt_tokens_set_as_httponly_cookies(self):
            response = self.client.post(self.register_url, self.user_data, format='json')

            self.assertEqual(response.status_code, 201)

            self.assertIn("access_token", response.cookies)
            self.assertIn("refresh_token", response.cookies)

            access_cookie: SimpleCookie = response.cookies["access_token"]
            refresh_cookie: SimpleCookie = response.cookies["refresh_token"]

            self.assertTrue(access_cookie["httponly"])
            self.assertTrue(refresh_cookie["httponly"])

            self.assertNotIn("access_token", response.data)
            self.assertNotIn("refresh_token", response.data)

class LoginTokenCookieTests(APITestCase):
    def setUp(self):
        self.login_url = reverse('get_token')
        self.credentials = {
            "username": "loginuser",
            "password": "strongpassword123"
        }

        User.objects.create_user(
            username=self.credentials["username"],
            password=self.credentials["password"],
        )

class LoginTests(APITestCase):
    def setUp(self):
        self.login_url = reverse("get_token")
        self.credentials = {
            "username": "testuser",
            "password": "securepassword123"
        }
        User.objects.create_user(
            username=self.credentials["username"],
            password=self.credentials["password"],
        )

    def test_login_with_valid_credentials(self):
        response = self.client.post(self.login_url, self.credentials, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("access_token", response.cookies)
        self.assertIn("refresh_token", response.cookies)

    def test_login_with_wrong_password(self):
        wrong_creds = {
            "username": self.credentials["username"],
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, wrong_creds, format="json")
        self.assertEqual(response.status_code, 401)
        self.assertNotIn("access_token", response.cookies)
        self.assertNotIn("refresh_token", response.cookies)

    def test_login_with_nonexistent_user(self):
        response = self.client.post(self.login_url, {
            "username": "nouser",
            "password": "whatever"
        }, format="json")
        self.assertEqual(response.status_code, 401)

    def test_login_with_missing_fields(self):
        response = self.client.post(self.login_url, {
            "username": "testuser"  
        }, format="json")
        self.assertEqual(response.status_code, 400)


class CreateTaskTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.url = reverse('create_task')
        self.task_data = {
            "body": "test task body"
        }

        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        self.client.cookies['access_token'] = access_token

    def test_create_task(self):
        response = self.client.post(self.url, self.task_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Task.objects.count(), 1)
        task = Task.objects.first()
        self.assertEqual(task.body, self.task_data["body"])
        self.assertEqual(task.user, self.user)


class UpdateTaskTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.url = reverse('update_task')

        self.existing_task = Task.objects.create(
            user=self.user,
            body="test task body",
            done=False,
            category="",
            deadline=None,
            priority=0
        )

        self.task_data = {
            "id": self.existing_task.id,
            "body": "update task body",
            "done": True,
            "category": "test",
            "deadline": None,
            "priority": 2,
        }

        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        self.client.cookies['access_token'] = access_token

    def test_update_task(self):
        response = self.client.put(self.url, self.task_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(Task.objects.count(), 1)
        task = Task.objects.first()
        self.assertEqual(task.body, self.task_data["body"])
        self.assertEqual(task.done, self.task_data["done"])
        self.assertEqual(task.category, self.task_data["category"])
        self.assertEqual(task.priority, self.task_data["priority"])
        self.assertEqual(task.user, self.user)


class DeleteTaskTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.url = reverse('delete_task')

        self.existing_task = Task.objects.create(
            user=self.user,
            body="test task body",
            done=False,
            category="",
            deadline=None,
            priority=0
        )

        self.task_data = {
            "id": self.existing_task.id,
        }

        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        self.client.cookies['access_token'] = access_token

    def test_delete_task(self):
        response = self.client.delete(self.url, self.task_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(Task.objects.count(), 0)
