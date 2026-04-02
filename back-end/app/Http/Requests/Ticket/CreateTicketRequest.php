<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;

class CreateTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'subject' => ['required'],
            'description' => ['required'],
            'status' => ['required'],
            'priority' => ['required'],
        ];
    }

    /**
     * Get the custom messages for the validation rules.
     */

    public function messages(): array
    {
    // adicione mensagens personalizadas para as regras de validação
        return [];
    }
}
