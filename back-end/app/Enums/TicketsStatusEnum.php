<?php

namespace App\Enums;

enum TicketsStatusEnum: int
{
    case OPEN = 1;
    case IN_PROGRESS = 2;
    case RESOLVED = 3;
    case CLOSED = 4;
}
