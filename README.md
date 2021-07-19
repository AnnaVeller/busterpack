# Busterpack
Ссылка на работающую программу: [https://annaveller.github.io/busterpack/](https://annaveller.github.io/busterpack/)

## Описание кода:
Класс Equipment описывает выпавший предмет и содержит 3 свойства: 
- имя
- редкость (common, uncommon, rare, legendary)
- тип предмета (weapon, helmet, armor, shield)

Класс Busterpack содержит 3 свойства: 
- редкость
- тип бустерпака (обычный, consistent, fair)
- массив с 5 предметами, выпавшими в этом бустерпаке

Методы класса Busterpack:
1. *improveRarity* - позволяет повысить редкость.
2. *getRandomEquipment* - возвращает рандомное оборудование заданной редкости
3. *randomInArray* - возвращает рандомный элемент из заданного массива
4. *checkIfAllEqInStore* - проверяет все ли оборудование редкости такой же что и бустерпак собрано. Возвращает массив НЕсобранного оборудования данной редкости.


Класс UsuallyPack наследует класс BusterPack. В нем появляется метод создания 5 предметов.

Класс ConsistentPack наследует класс BusterPack. В нем метод создания 5 предметов отличается от UsuallyPack тем, что не разрешается появление 3 и более одинаковых предметов в одном бустерпаке.

Класс FairPack наследует класс ConsistentPack. FairPack после 24 собранных штук одинаковой редкости **обязательно** соберет полный комплект оборудования данной редкости. Есть разные алгоритмы, позволяющие реализовать данный функционал, например высчитывать веса, однако в данном случае вероятность, что к 24 бустерпаку будет собран полный комплект крайне высока, поэтому данный код не использует веса, а просто проверяет собран ли полный комплект на 23-24 шаге и если не собран искусственно вводит недостающее оборудование. 

Класс MyEquipment хранит все собранные предметы и содержит два свойства: 
- equipments - массив объектов, где в каждом объекте лежит оборудование и количество такого оборудования на складе
- busterpacks - объект, в качестве ключей [редкость]_[тип бустерпака]

Методы класса MyEquipment:
1.  *addEquipment* - добавляет оборудование в хранилище
2.  *getEquipmentRarity* - возвращает все предметы из хранилища, которые имеют заданную редкость
3.  *showInTextarea* - показывает собранное оборудование в текстовом поле на странице
4.  *addBusterpack* - сохраняет какие бустерпаки были собраны
5.  *getCountBusterpack* - возвращает количество полученных бустерпаков таких же как заданным 

В программе создается myEq = класс MyEquipment, в котором хранится все ваше оборудование.
Чтобы просмотреть все ваше оборудование, например редкости RARE, необходимо вызвать *myEq.getEquipmentRarity('RARE')*. Вам вернется массив со всеми предметами.
Чтобы увидеть абсолютно все собранное оборудование можно вызвать *myEq.equipments*

На странице сделано визуально удобные кнопки, чтобы не использовать консоль. Однако все функции ниже можно вызвать и просто в консоли.

Чтобы открыть бустерпаки необходимо вызвать функции:
- *openUsuallyBusterpack (rarity)* - для открытия обычного бустерпака заданной редкости
- *openConsistentBusterpack (rarity)* - для открытия consistent бустерпака 
- *openFairBusterpack (rarity)* - для открытия fair бустерпака 
- *openManyUsuallyPack (rarity, count)* - для открытия обычных бустерпаков в количестве count штук
- *openManyConsistentPack (rarity, count)* - для открытия consistent бустерпаков в количестве count штук
- *openManyFairPack (rarity, count)* - для открытия fair бустерпаков в количестве count штук









