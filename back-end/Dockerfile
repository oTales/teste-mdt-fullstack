FROM php:8.4-fpm-alpine

WORKDIR /var/www

ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN install-php-extensions \
    pdo_mysql \
    pcntl \
    bcmath \
    gd \
    intl \
    xml \
    redis \
    xdebug

RUN apk add --no-cache \
    git \
    curl \
    bash


COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN adduser -D -s /bin/bash mdt-user \
    && mkdir -p /var/www/bootstrap/cache /var/www/storage \
    && chown -R mdt-user:mdt-user /var/www \
    && chmod -R 777 /var/www/bootstrap/cache /var/www/storage /var/www

ADD docker/xdebug/xdebug.ini /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
COPY ./docker/php/laravel.ini /usr/local/etc/php/conf.d/99-laravel.ini

RUN echo -e "\
    alias pa='php artisan'\n\
    alias migrate='php artisan migrate'\n\
    alias seed='php artisan db:seed'\n\
    alias tinker='php artisan tinker'\n\
    alias reverb='php artisan reverb:start'\n\
    alias horizon='php artisan horizon'\n\
    alias ziggy='php artisan ziggy:generate'\n\
    alias clear='php artisan optimize:clear'" \
    >> /home/mdt-user/.bashrc \
    && echo "export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" >> ~/.bashrc

EXPOSE 9000

USER mdt-user
