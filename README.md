# iPop 
Скрипт задуман, как максимально простой способ для формирования видео и фото коллекций на статических и CMS сайтов.
Используя 4 класса для ссылок
 - **iPop-video** - поддерживается 3 видеохостинга **YouTube**, **RuTube**, частично **VK-видео** (нет автопревью)
 - **iPop-img** - одиночные изображения и группы, описание в теге title
 - **iPop-frame** - popup если известен url iframe
 - **iPop-up** - popup с привязкой по id


###  Демо страница https://da0ab.github.io/iPop/

## iPop-video 

### YouTube
- превью забирается автоматически
- если внутри ссылки есть изображение превью не забирается
- класс **Ytube-mini** забирает малое превью
- временя начала показа в формате **&t=445**
- работают ссыли **youtu.be** и **youtube.com**
- автоплей

```HTML
<a href="https://youtu.be/94Y9gMF-qL0" class="iPop-video"></a>
<a href="https://youtu.be/94Y9gMF-qL0" class="iPop-video Ytube-mini"></a>
<a href="https://youtu.be/94Y9gMF-qL0?si=sd-uIzMruopssG-s&t=445" class="iPop-video"></a>
```
### RuTube
- превью забирается автоматически
- если внутри ссылки есть изображение превью не забирается
- временя начала показа в формате **/?t=90**

 ```HTML
<a href="https://rutube.ru/video/35f549128069e557ddadd549b014ca84/?r=wd" class="iPop-video"></a>
<a href="https://rutube.ru/video/35f549128069e557ddadd549b014ca84/?t=90" class="iPop-video"></a>
```
### VK-видео
- превью нужно самостоятельно положить в папку **images/video/**
- имя файла соответствует **id** видео без времени **video-119098218_456239140__cover.jpg**
- временя начала показа в формате **?start=90**
- работают ссылки с **vk.com** и **vkvideo.ru**
- автоплей

Обложки можно забрать через сервис https://smm-e.ru/services/vk/videos/download-cover/
 
```HTML
<a href="https://vk.com/video-119098218_456239140?start=90" class="iPop-video"></a>
<a href="https://vkvideo.ru/video-119098218_456239140?start=90" class="iPop-video"></a>
```

## iPop-img

```HTML
<a href="images/photo/01.jpg" class="iPop-img"><img src="images/photo/t/01.jpg" alt="" title="Я не в группе"></a>
```
**data-iPop-group="group1"** для создания групп изображений

```HTML                    
<a href="images/photo/02.jpg" class="iPop-img" data-iPop-group="group1"><img src="images/photo/t/02.jpg" alt="" title="Текст есть"></a>
<a href="images/photo/03.jpg" class="iPop-img" data-iPop-group="group1"><img src="images/photo/t/03.jpg" alt="" title=""></a>
```
Если **title** изображения заполнен, текст выводится под изображением в всплывающем окне

## iPop-frame

```HTML 
<a href="https://yandex.ru/map-widget/v1/?um=constructor%3Afbc06e4a7351d44f85aa4e3e5637b42daf0ac6c0ca27e1fdd7f75b79ac241526"
class="iPop-iframe">Текст или изображение</a>
```

## iPop-up

```HTML 
<a href="#id-1" class="iPop-up">Ссылка на окно #id-1</a>                    
<div class="iPop-up-data" id="id-1">
  <p>Содержимое всплывающего окна</p> 
</div>
```
