# iPop 
Скрипт задуман, как максимально простой способ для формирования видео и фото коллекций на страницах статических и CMS

***

Используя 4 класса на ссылках

### iPop-video

Для **YouTube** и **RuTube** - если внутри ссылки свое изображение то превью не генериться

Для **YouTube** превью забирается автоматически, класс **Ytube-mini** забирает малое превью, поддерживается указание времени начала показа формата **&t=445**
```HTML
<a href="https://youtu.be/94Y9gMF-qL0" class="iPop-video"></a>
<a href="https://youtu.be/94Y9gMF-qL0" class="iPop-video Ytube-mini"></a>
<a href="https://youtu.be/94Y9gMF-qL0?si=sd-uIzMruopssG-s&t=445" class="iPop-video"></a>
```

Для **RuTube** превью забирается автоматически, поддерживается указание времени начала показа формата **/?t=90**
 ```HTML
<a href="https://rutube.ru/video/35f549128069e557ddadd549b014ca84/?r=wd" class="iPop-video"></a>
<a href="https://rutube.ru/video/35f549128069e557ddadd549b014ca84/?t=90" class="iPop-video"></a>
```
**VK-видео** превью устанавливается в ручную,  поддерживается указание времени начала показа формата **?start=90**
```HTML
<a href="https://vk.com/video-119098218_456239140?start=90" class="iPop-video"><img src="https://images.placeholders.dev/?width=1280&height=720" alt="" title=""></a>
```

### iPop-img

```HTML
<a href="images/photo/01.jpg" class="iPop-img"><img src="images/photo/t/01.jpg" alt="" title="Я не в группе"></a>
```
**data-iPop-group="group1"** для создания групп изображений

```HTML                    
<a href="images/photo/02.jpg" class="iPop-img" data-iPop-group="group1"><img src="images/photo/t/02.jpg" alt="" title=""></a>
<a href="images/photo/03.jpg" class="iPop-img" data-iPop-group="group1"><img src="images/photo/t/03.jpg" alt="" title=""></a>
```

### iPop-frame

```HTML 
<a href="https://yandex.ru/map-widget/v1/?um=constructor%3Afbc06e4a7351d44f85aa4e3e5637b42daf0ac6c0ca27e1fdd7f75b79ac241526&amp;source=constructor"
class="iPop-iframe">Текст или изображение</a>
```

### iPop-up

```HTML 
<a href="#id-1" frameborder="0" class="iPop-up">Ссылка на окно #id-1</a>                    
<div class="iPop-up-data" id="id-1">
  <p>Содержимое всплывающего окна</p> 
</div>
```
