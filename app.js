var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var EQUIPMENT_RARITY = ['COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY'];
var EQUIPMENT_TYPE = ['WEAPON', 'HELMET', 'ARMOR', 'SHIELD'];
var AVAILABLE_RARITY_BUSTERPACK = EQUIPMENT_RARITY.slice(1);
console.log('Доступные бустерпаки:', AVAILABLE_RARITY_BUSTERPACK);
var Equipment = /** @class */ (function () {
    function Equipment(name, rarity, type) {
        this.name = name;
        this.rarity = rarity;
        this.type = type;
    }
    return Equipment;
}());
var BusterPack = /** @class */ (function () {
    function BusterPack(rarity) {
        this.rarity = rarity;
        this.equipment = [];
    }
    // if you are lucky, you may increase you busterpack cards rarity
    // put rarity and return this rarity or higher by 1/2/3 levels
    BusterPack.prototype._improveRarity = function (rarity) {
        var indexOfRarity = EQUIPMENT_RARITY.indexOf(rarity); // index of rarity
        var item = 0;
        var p = Math.random();
        console.log('Вам выпала вероятность: ', p);
        if (p < 0.001 && indexOfRarity + 3 < EQUIPMENT_RARITY.length) {
            item = 3;
            console.log('Вам невьебенно повезло! Повышение на 3 позиции');
        }
        else if (p < 0.01 && indexOfRarity + 2 < EQUIPMENT_RARITY.length) {
            item = 2;
            console.log('Вам очень повезло! Повышение на 2 позиции');
        }
        else if (p < 0.1 && indexOfRarity + 1 < EQUIPMENT_RARITY.length) {
            item = 1;
            console.log('Вам повезло! Повышение на 1 позицию');
        }
        return EQUIPMENT_RARITY[indexOfRarity + item];
    };
    // get random equipment by definite rarity
    BusterPack.prototype._getRandomEquipment = function (rarity) {
        return this._randomInArray(equipments.filter(function (el) { return el.rarity === rarity; }));
    };
    // return random value from array
    BusterPack.prototype._randomInArray = function (array) {
        return array[Math.floor(Math.random() * array.length)];
    };
    return BusterPack;
}());
var UsuallyPack = /** @class */ (function (_super) {
    __extends(UsuallyPack, _super);
    function UsuallyPack(rarity) {
        var _this = _super.call(this, rarity) || this;
        _this._createEquipments();
        console.log('Создали обычный бустерпак:', _this.equipment);
        return _this;
    }
    UsuallyPack.prototype._createEquipments = function () {
        for (var i = 0; i < 5; i++) {
            var rarity = (i < 2) ? this.rarity : EQUIPMENT_RARITY[EQUIPMENT_RARITY.indexOf(this.rarity) - 1];
            rarity = this._improveRarity(rarity); // the ability to increase rarity
            var eq = this._getRandomEquipment(rarity);
            this.equipment.push(eq);
        }
    };
    return UsuallyPack;
}(BusterPack));
var ConsistentPack = /** @class */ (function (_super) {
    __extends(ConsistentPack, _super);
    function ConsistentPack(rarity) {
        var _this = _super.call(this, rarity) || this;
        _this._createEquipments();
        console.log('Создали консистент бустерпак:', _this.equipment);
        return _this;
    }
    // No more than two equipments of the same type
    ConsistentPack.prototype._createEquipments = function () {
        var _loop_1 = function (i) {
            var rarity = (i < 2) ? this_1.rarity : EQUIPMENT_RARITY[EQUIPMENT_RARITY.indexOf(this_1.rarity) - 1];
            rarity = this_1._improveRarity(rarity); // the ability to increase rarity
            var eq = this_1._getRandomEquipment(rarity);
            var thisTypeCount = this_1.equipment.filter(function (el) { return el.type === eq.type; }).length;
            while (thisTypeCount >= 2) {
                console.log('Уже существует два типа: ', eq.type, 'в', this_1.equipment.map(function (el) { return el.type; }));
                eq = this_1._getRandomEquipment(rarity);
                thisTypeCount = this_1.equipment.filter(function (el) { return el.type === eq.type; }).length;
            }
            this_1.equipment.push(eq);
        };
        var this_1 = this;
        for (var i = 0; i < 5; i++) {
            _loop_1(i);
        }
    };
    return ConsistentPack;
}(BusterPack));
// my store with all equipments
var MyEquipment = /** @class */ (function () {
    function MyEquipment() {
        this.equipments = [];
        this.busterpacks = {};
        for (var i = 0; i < EQUIPMENT_RARITY.length; i++) {
            this.busterpacks[EQUIPMENT_RARITY[i]] = 0;
        }
    }
    MyEquipment.prototype.addEquipment = function (eqs) {
        var _this = this;
        eqs.forEach(function (oneEq) {
            //Если такой предмет уже был в инвентаре, то мы его получим сейчас, если нет то []
            var eqInStore = _this.equipments.filter(function (el) { return oneEq.name === el.eq.name; });
            if (eqInStore.length === 0) {
                _this.equipments.push({ count: 1, eq: oneEq });
            }
            else {
                eqInStore[0].count += 1;
            }
        });
    };
    MyEquipment.prototype.getEquipmentRarity = function (rarity) {
        return this.equipments.filter(function (el) { return el.eq.rarity === rarity; }).sort(function (a, b) { return a.eq.name > b.eq.name ? 1 : -1; });
    };
    MyEquipment.prototype.showInTextarea = function () {
        var textarea = document.getElementById("textarea-eqs");
        textarea.value = '';
        for (var i = 0; i < EQUIPMENT_RARITY.length; i++) {
            if (i !== 0)
                textarea.value += '\n';
            textarea.value += EQUIPMENT_RARITY[i];
            var arr = this.getEquipmentRarity(EQUIPMENT_RARITY[i]);
            if (arr.length === 8) {
                textarea.value += ' (собраны все предметы)';
            }
            textarea.value += '\n';
            for (var j = 0; j < arr.length; j++) {
                textarea.value += j + 1 + ") \u0438\u043C\u044F: " + arr[j].eq.name + " \u043A\u043E\u043B-\u0432\u043E: " + arr[j].count + " \n";
            }
        }
    };
    MyEquipment.prototype.addBusterpack = function (busterpack) {
        this.busterpacks[busterpack.rarity] += 1;
    };
    MyEquipment.prototype.getCountBusterpack = function (busterpack) {
        return this.busterpacks[busterpack.rarity];
    };
    return MyEquipment;
}());
// open buster this definite rarity
function _openBusterpack(busterpack) {
    busterpack.rarity = busterpack.rarity.toUpperCase();
    if (AVAILABLE_RARITY_BUSTERPACK.indexOf(busterpack.rarity) === -1) {
        alert('Такой редкости не существует!');
        return;
    }
    console.log('Вам выпал бустерпак:', busterpack);
    console.log('ПРЕДМЕТЫ: ', busterpack.equipment.map(function (el) { return el.rarity + " " + el.type; }));
    myEq.addEquipment(busterpack.equipment);
    myEq.showInTextarea();
    myEq.addBusterpack(busterpack);
    // create textarea with busterpack info
    createTextarea(busterpack, myEq.getCountBusterpack(busterpack));
    return busterpack;
}
// open usually busterpack
function openUsuallyBusterpack(rarity) {
    _openBusterpack(new UsuallyPack(rarity));
}
// open consistent busterpack
function openConsistentBusterpack(rarity) {
    _openBusterpack(new ConsistentPack(rarity));
}
function createTextarea(busterpack, count) {
    console.log('buster in createTextarea', busterpack);
    var textarea = document.getElementById("textarea");
    var oldText = textarea.value;
    textarea.value = 'Редкость бустерпака: ' + busterpack.rarity + ' №' + count + '\n';
    busterpack.equipment.forEach(function (el, i) {
        textarea.value += i + 1 + ") \u0442\u0438\u043F: " + el.type.padEnd(6) + " \u0440\u0435\u0434\u043A\u043E\u0441\u0442\u044C: " + el.rarity.padEnd(9) + " \u0438\u043C\u044F: " + el.name + "\n";
    });
    textarea.value += '\n' + oldText;
}
function openManyConsistentPack(rarity, count) {
    if (!count) {
        alert('Введите ненулевое количество!');
        return;
    }
    for (var i = 0; i < count; i++) {
        openConsistentBusterpack(rarity);
    }
}
// create 32 new
var equipments = [];
for (var _i = 0, EQUIPMENT_TYPE_1 = EQUIPMENT_TYPE; _i < EQUIPMENT_TYPE_1.length; _i++) {
    var type = EQUIPMENT_TYPE_1[_i];
    for (var _a = 0, EQUIPMENT_RARITY_1 = EQUIPMENT_RARITY; _a < EQUIPMENT_RARITY_1.length; _a++) {
        var rarity = EQUIPMENT_RARITY_1[_a];
        equipments.push(new Equipment(type + "_" + rarity + "_1", rarity, type));
        equipments.push(new Equipment(type + "_" + rarity + "_2", rarity, type));
    }
}
console.log(equipments);
var myEq = new MyEquipment();
