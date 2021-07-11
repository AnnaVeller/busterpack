const EQUIPMENT_RARITY: string[] = ['COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY'];
const EQUIPMENT_TYPE: string[] = ['WEAPON', 'HELMET', 'ARMOR', 'SHIELD'];
const AVAILABLE_RARITY_BUSTERPACK: string[] = EQUIPMENT_RARITY.slice(1);
console.log('Доступные бустерпаки:', AVAILABLE_RARITY_BUSTERPACK);

class Equipment {
    name: string;
    rarity: string;
    type: string;

    constructor(name: string, rarity: string, type: string) {
        this.name = name;
        this.rarity = rarity;
        this.type = type;
    }
}

class BusterPack {
    rarity: string;
    equipment: Equipment[];

    constructor(rarity: string) {
        this.rarity = rarity;
        this.equipment = [];
    }

    // if you are lucky, you may increase you busterpack cards rarity
    // put rarity and return this rarity or higher by 1/2/3 levels
    _improveRarity(rarity: string) {
        const indexOfRarity: number = EQUIPMENT_RARITY.indexOf(rarity); // index of rarity
        let item: number = 0;
        const p = Math.random();
        console.log('Вам выпала вероятность: ', p);
        if (p < 0.001 && indexOfRarity + 3 < EQUIPMENT_RARITY.length) {
            item = 3;
            console.log('Вам невьебенно повезло! Повышение на 3 позиции');
        } else if (p < 0.01 && indexOfRarity + 2 < EQUIPMENT_RARITY.length) {
            item = 2;
            console.log('Вам очень повезло! Повышение на 2 позиции');
        } else if (p < 0.1 && indexOfRarity + 1 < EQUIPMENT_RARITY.length) {
            item = 1;
            console.log('Вам повезло! Повышение на 1 позицию');
        }
        return EQUIPMENT_RARITY[indexOfRarity + item];
    }


    // get random equipment by definite rarity
    _getRandomEquipment(rarity: string) {
        return this._randomInArray(equipments.filter(el => el.rarity === rarity));
    }

    // return random value from array
    _randomInArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
}

class UsuallyPack extends BusterPack {
    constructor(rarity: string) {
        super(rarity);
        this._createEquipments();
        console.log('Создали обычный бустерпак:', this.equipment);
    }

    _createEquipments() {
        for (let i = 0; i < 5; i++) {
            let rarity: string = (i < 2) ? this.rarity : EQUIPMENT_RARITY[EQUIPMENT_RARITY.indexOf(this.rarity) - 1];
            rarity = this._improveRarity(rarity); // the ability to increase rarity
            const eq: Equipment = this._getRandomEquipment(rarity);
            this.equipment.push(eq);
        }
    }
}

class ConsistentPack extends BusterPack {
    constructor(rarity: string) {
        super(rarity);
        this._createEquipments();
        console.log('Создали консистент бустерпак:', this.equipment);
    }

    // No more than two equipments of the same type
    _createEquipments() {
        for (let i = 0; i < 5; i++) {
            let rarity: string = (i < 2) ? this.rarity : EQUIPMENT_RARITY[EQUIPMENT_RARITY.indexOf(this.rarity) - 1];
            rarity = this._improveRarity(rarity); // the ability to increase rarity
            let eq: Equipment = this._getRandomEquipment(rarity);
            let thisTypeCount: number = this.equipment.filter(el => el.type === eq.type).length;

            while (thisTypeCount >= 2) {
                console.log('Уже существует два типа: ', eq.type, 'в', this.equipment.map(el => el.type));
                eq = this._getRandomEquipment(rarity);
                thisTypeCount = this.equipment.filter(el => el.type === eq.type).length;
            }
            this.equipment.push(eq);
        }
    }
}

// my store with all equipments
class MyEquipment {
    equipments: { count: number, eq: Equipment }[];
    busterpacks: {}

    constructor() {
        this.equipments = [];
        this.busterpacks = {};
        for (let i = 0; i < EQUIPMENT_RARITY.length; i++) {
            this.busterpacks[EQUIPMENT_RARITY[i]] = 0;
        }
    }

    addEquipment(eqs: Equipment[]) {
        eqs.forEach(oneEq => {
                //Если такой предмет уже был в инвентаре, то мы его получим сейчас, если нет то []
                const eqInStore = this.equipments.filter(el => oneEq.name === el.eq.name);

                if (eqInStore.length === 0) {
                    this.equipments.push({count: 1, eq: oneEq});
                } else {
                    eqInStore[0].count += 1;
                }
            }
        );
    }

    getEquipmentRarity(rarity: string) {
        return this.equipments.filter(el => el.eq.rarity === rarity).sort((a, b) => a.eq.name > b.eq.name ? 1 : -1);
    }

    showInTextarea() {
        const textarea = (<HTMLInputElement>document.getElementById("textarea-eqs"));
        textarea.value = '';
        for (let i = 0; i < EQUIPMENT_RARITY.length; i++) {
            if (i !== 0) textarea.value += '\n'
            textarea.value += EQUIPMENT_RARITY[i];
            const arr = this.getEquipmentRarity(EQUIPMENT_RARITY[i]);
            if (arr.length === 8) {
                textarea.value += ' (собраны все предметы)';
            }
            textarea.value += '\n';
            for (let j = 0; j < arr.length; j++) {
                textarea.value += `${j + 1}) имя: ${arr[j].eq.name} кол-во: ${arr[j].count} \n`;
            }
        }
    }

    addBusterpack(busterpack: BusterPack) {
        this.busterpacks[busterpack.rarity] += 1;
    }

    getCountBusterpack(busterpack: BusterPack) {
        return this.busterpacks[busterpack.rarity];
    }
}

// open buster this definite rarity
function _openBusterpack(busterpack) {
    busterpack.rarity = busterpack.rarity.toUpperCase();
    if (AVAILABLE_RARITY_BUSTERPACK.indexOf(busterpack.rarity) === -1) {
        alert('Такой редкости не существует!');
        return
    }

    console.log('Вам выпал бустерпак:', busterpack)
    console.log('ПРЕДМЕТЫ: ', busterpack.equipment.map(el => `${el.rarity} ${el.type}`));

    myEq.addEquipment(busterpack.equipment);
    myEq.showInTextarea();
    myEq.addBusterpack(busterpack);
    // create textarea with busterpack info
    createTextarea(busterpack, myEq.getCountBusterpack(busterpack));
    return busterpack;
}

// open usually busterpack
function openUsuallyBusterpack(rarity: string) {
    _openBusterpack(new UsuallyPack(rarity));
}

// open consistent busterpack
function openConsistentBusterpack(rarity: string) {
    _openBusterpack(new ConsistentPack(rarity));
}

function createTextarea(busterpack, count) {
    console.log('buster in createTextarea', busterpack);
    const textarea = (<HTMLInputElement>document.getElementById("textarea"));
    const oldText = textarea.value;
    textarea.value = 'Редкость бустерпака: ' + busterpack.rarity + ' №' + count + '\n';
    busterpack.equipment.forEach((el, i) => {
        textarea.value += `${i + 1}) тип: ${el.type.padEnd(6)} редкость: ${el.rarity.padEnd(9)} имя: ${el.name}\n`;
    });
    textarea.value += '\n' + oldText;
}

function openManyConsistentPack(rarity: string, count: number) {
    if (!count) {
        alert('Введите ненулевое количество!');
        return;
    }

    for (let i = 0; i < count; i++) {
        openConsistentBusterpack(rarity);
    }
}

// create 32 new
const equipments: Equipment[] = [];
for (let type of EQUIPMENT_TYPE) {
    for (let rarity of EQUIPMENT_RARITY) {
        equipments.push(new Equipment(`${type}_${rarity}_1`, rarity, type));
        equipments.push(new Equipment(`${type}_${rarity}_2`, rarity, type));
    }
}
console.log(equipments);
const myEq = new MyEquipment();
