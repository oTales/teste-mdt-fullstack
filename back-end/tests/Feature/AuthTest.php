<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user registration
     */
    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'user' => ['id', 'name', 'email'],
            'token',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
        ]);
    }

    /**
     * Test user login
     */
    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'message',
            'user' => ['id', 'name', 'email'],
            'token',
        ]);
    }

    /**
     * Test login with invalid credentials
     */
    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test authenticated user can access /me endpoint
     */
    public function test_authenticated_user_can_access_me_endpoint(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/me');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'user' => ['id', 'name', 'email'],
        ]);
    }

    /**
     * Test unauthenticated user cannot access /me endpoint
     */
    public function test_unauthenticated_user_cannot_access_me_endpoint(): void
    {
        $response = $this->getJson('/api/me');

        $response->assertStatus(401);
    }

    /**
     * Test user can logout
     */
    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/logout');

        $response->assertStatus(200);
        $response->assertJson([
            'message' => 'Logout realizado com sucesso',
        ]);
    }

    /**
     * Test register validation
     */
    public function test_register_validation(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => '123',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    /**
     * Test duplicate email registration
     */
    public function test_cannot_register_with_duplicate_email(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $response = $this->postJson('/api/register', [
            'name' => 'Another User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }
}

