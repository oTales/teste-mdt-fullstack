<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first() ?? User::factory()->create();

        Ticket::factory(5)
            ->for($user)
            ->open()
            ->highPriority()
            ->create();

        Ticket::factory(8)
            ->for($user)
            ->inProgress()
            ->create();

        Ticket::factory(3)
            ->for($user)
            ->resolved()
            ->create();

        Ticket::factory(2)
            ->for($user)
            ->closed()
            ->lowPriority()
            ->create();

        User::factory(3)->create()->each(function ($user) {
            Ticket::factory(3)
                ->for($user)
                ->open()
                ->create();
        });
    }
}

