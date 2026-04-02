<?php

namespace App\Notifications;

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyUserTicketCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $user,
        public Ticket $ticket
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)->view('emails.board-notification', [
            'tag' => 'Novo Ticket',
            'title' => 'Ticket Criado: ' . $this->ticket->subject,
            'content' => 'Olá <strong>' . $this->user->name . '</strong>,<br><br>Seu ticket <strong>#' . $this->ticket->hash . '</strong> foi criado com sucesso e encontra-se na coluna <span style="color:#4f8ef7">To-Do</span>.',
            'actionUrl' => url('/tickets/' . $this->ticket->hash),
            'actionText' => 'Ver Ticket'
        ])->subject('Ticket Criado: ' . $this->ticket->subject);
    }
}
