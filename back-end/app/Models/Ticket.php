<?php

namespace App\Models;

use App\Enums\TicketsPriorityEnum;
use App\Enums\TicketsStatusEnum;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use App\Traits\HasHashIds;

#[Fillable(['user_id', 'hash', 'name', 'subject', 'description', 'status', 'priority'])]
#[Hidden(['id', 'user_id'])]

class Ticket extends Model
{
    use HasHashIds,HasFactory;

    protected $table = 'tickets';

    protected static function boot():void
    {
        parent::boot();
        static::created(function ($ticket) {
            $ticket->hash = $ticket->hash();
            $ticket->save();
        });
    }

    protected function casts(): array
    {
        return [
            'status' => TicketsStatusEnum::class,
            'priority' => TicketsPriorityEnum::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
