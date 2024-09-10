# Patron CRM

Идея проекта в том, чтобы разработать идеальную CRM систему на JavaScript.
Для того, чтобы получить идеальную систему опираюсь на:
- Object Thinking
- ElegantObjects
- Clean Architecture

## Что такое Patron

Patron - это постоянный псетитель. Идея родилась после прочтения книги Elegant Objects. Захотелось перенести концепцию EO на JS, но оказалось что это не так просто, потому что в JS мы имеем один поток выполнения кода, и управляем асинхронностью вручную, поэтому появилась идея использовать паттерн Visitor, чтобы объекты внутри своей логики сами управляли асинхронностью и передавали результаты дальше следующим объектам тогда, когда чистые данные будут у объекта.
