<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyUserCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public User $user
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)->view('emails.board-notification', [
            'tag' => 'Boas-vindas',
            'title' => 'Bem-vindo ao Tickets Board!',
            'content' => 'Olá <strong>' . $this->user->name . '</strong>,<br><br>Sua conta foi criada com sucesso! Agora você pode gerenciar seus tickets e interagir com as colunas do Kanban.',
        ])->subject('Bem-vindo ao Tickets Board');
    }
}

