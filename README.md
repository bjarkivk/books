# [Hópverkefni 1](https://h1books.herokuapp.com/) - _Vefforritun 2_ (HBV403G vor 2018)

<br>
<hr>

## Upplýsingar um hvernig setja skal setja upp verkefnið

Búa skal til gagnagrunn með því að keyra schema.sql skránna.
Til þess að koma öllum upplýsingum inn í gagnagrunninn þarf svo að keyra createdb.js skránna.

````
$ node createdb.js
      Done inserting categories...
      Inserting books...
````

<br>
<hr>

## Dæmi um köll í vefþjónustu

* `POST` á `/register` með 
```json
{
  "username": "notandi",
  "name": "Notandi Jónsson",
  "password": "123456" 
}
```
býr til notandann og skilar
```json
{
    "username": "notandi",
    "name": "Notandi Jónsson"
}
```

* `POST` á `/login` með 
```json
{
  "username": "notandi",
  "password": "123456" 
}
```
skráir notandann inn og skilar token, t.d. :
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNTIxNjQxMTgwLCJleHAiOjE1Mjc2NDExODB9.QuMUvXci1uyAQS8pv9uoci_K8x7130UWgt6nY7OUi0E"
}
```

* `GET` á `/users` þegar notandi er innskráður skilar lista af notendum, hægt er að tilgreina limit og offset í query streng. Til dæmis `/users?limit=2&offset=1`

* `GET` á `/users/:id` þegar notandi er innskráður skilar upplýsingum um þann notanda sem hefur það id sem er tilgreint.

* `GET` á `/users/me` þegar notandi er innskráður skilar upplýsingum um notandann sem er nú þegar innskráður.

* `PATCH` á `/users/me` þegar notandi er innskráður með 
```json
{
    "name": "Notandi Sigurðarson",
    "password": "123"
}
```
uppfærir upplýsingar um notanda og skilar notandaupplýsingum.

* `multipart/form-data POST` á `/users/me/profile` með **`key = image`**  uppfærir prófílmynd notanda.

* `GET` á `/categories` sýnir alla flokka.

* `POST` á `/categories` með
```json
{
    "category": "Christmas stories"
}
```
býr til flokkinn Christmas stories og skilar honum.

* `GET` á `/books` sýnir allar bækur.

* `POST` á `/books` með
```json
{
    "title": "Páskabók 3",
    "category": "Fantasy",
    "isbn13": "9783601387619"
}
```
býr til bókina og skilar henni.

* `GET` á `/books?search=potter` sýnir allar bækur sem hafa orðið 'potter' í title eða description.

* `GET` á `/books/:id` skilar þeirri bók sem hefur samsvarandi id.

* `PATCH` á `/books/:id` með
```json
{
    "title": "Páskabók 4",
    "category": "Fantasy",
    "isbn13": "9783601387619"
}
```
uppfærir bókina í gagnagrunninum sem hefur samsvarandi id og í slóðinni.

* `GET` á `/users/:id/read` skilar lesnum bókum notanda með samsvarandi id.

* `GET` á `/users/me/read` skilar lesnum bókum notanda sem er innskráður.

* `POST` á `/users/me/read` með

```json
{
    "id": "500",
    "reviewTitle": "Great book",
    "reviewText": "Best book I have read",
    "rating": "5"
}
```
býr til lestur á bók með id 500 í gagnagrunninum. Einnig má tilgreina id í query string sem sagt `/users/me/read?id=500`

* `DELETE` á `/users/me/read/:id` eyðir lestri á þeirri bók með tilsvarandi id fyrir innskráðan notanda.

<br>
<hr>

## Nöfn og notendanöfn allra í hóp


\- [Bjarki Viðar Kristjánsson](https://github.com/bjarkivk/), bvk1@hi.is <br>
\- [Huy Van Nguyen](https://github.com/serpentisx/), hvn1@hi.is
