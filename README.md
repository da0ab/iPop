# iPop 
Скрипт задуман, как максимально простой способ для формирования видео и фото коллекций на страницах статических и CMS

***

Используя 4 класса на ссылках

### iPop-video


Для RuTube превью забирается автоматически
 ```HTML
   <a href="https://rutube.ru/video/c5ae772548357e2d2bd083c239da7092/?r=wd" class="iPop-video"></a>
```

Для YouTube превью забирается автоматически
```HTML
<a href="https://youtu.be/94Y9gMF-qL0" class="iPop-video"></a>
```

Для YouTube дополнительный класс Ytube-mini для использования мелкого автоматического превью
```HTML
<a href="https://youtu.be/94Y9gMF-qL0" class="iPop-video Ytube-mini"></a>
```

Для YouTube с указанным временем показа
```HTML
   <a href="https://youtu.be/55rxdkMR-lg?si=v4wzIBrhemlpzLUr&t=1505" class="iPop-video"></a>
```

Для YouTube и RuTube - если внутри ссылки свое изображение

ВК-видео превью устанавливается в ручную
```HTML
   <a href="https://vk.com/video-26555975_456240213" class="iPop-video"><img src="images/vk.jpg" alt="" title=""></a>
```


### iPop-img


### iPop-frame

### iPop-up
