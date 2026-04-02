<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;600;700;800&display=swap');
  body {
    margin: 0; padding: 0; background-color: #1a1a1a;
    font-family: 'Syne', Helvetica, Arial, sans-serif; color: #f0f0f0;
  }
  .container {
    max-width: 600px; margin: 0 auto; padding: 40px 20px;
  }
  .card {
    background-color: #111111; border: 1px solid #2e2e2e;
    border-radius: 12px; padding: 32px;
  }
  .header {
    font-family: 'DM Mono', monospace; font-size: 11px;
    letter-spacing: .15em; text-transform: uppercase;
    color: #8a8a8a; margin-bottom: 24px; border-bottom: 1px solid #252525; padding-bottom: 16px;
  }
  .title {
    font-size: 24px; font-weight: 700; color: #f0f0f0; margin-bottom: 16px;
  }
  .content {
    font-size: 15px; color: #8a8a8a; line-height: 1.6; margin-bottom: 32px;
  }
  .btn {
    display: inline-block; background-color: #4f8ef7; color: #ffffff;
    font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500;
    text-decoration: none; padding: 12px 24px; border-radius: 6px;
    letter-spacing: .05em; text-transform: uppercase;
  }
  .footer {
    margin-top: 32px; font-family: 'DM Mono', monospace;
    font-size: 10px; color: #555555; text-align: center;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        Task Board — {{ $tag ?? 'Notificação' }}
      </div>
      <div class="title">
        {{ $title }}
      </div>
      <div class="content">
        {!! $content !!}
      </div>
      @if(isset($actionUrl))
        <a href="{{ $actionUrl }}" class="btn">{{ $actionText ?? 'Acessar' }}</a>
      @endif
    </div>
    <div class="footer">
      Tickets Board Design System · Dark Theme © {{ date('Y') }}
    </div>
  </div>
</body>
</html>
