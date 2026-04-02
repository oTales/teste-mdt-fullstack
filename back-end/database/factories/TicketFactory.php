<?php

namespace Database\Factories;

use App\Enums\TicketsPriorityEnum;
use App\Enums\TicketsStatusEnum;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ticket>
 */
class TicketFactory extends Factory
{


    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->name(),
            'subject' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(TicketsStatusEnum::cases()),
            'priority' => fake()->randomElement(TicketsPriorityEnum::cases()),
        ];
    }

    public function open(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TicketsStatusEnum::OPEN->value,
        ]);
    }

    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TicketsStatusEnum::IN_PROGRESS->value,
        ]);
    }

    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TicketsStatusEnum::RESOLVED->value,
        ]);
    }

    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => TicketsStatusEnum::CLOSED->value,
        ]);
    }

    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => TicketsPriorityEnum::URGENT->value,
        ]);
    }

    public function lowPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => TicketsPriorityEnum::LOW->value,
        ]);
    }
}
