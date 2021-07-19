const EQUIPMENT_RARITY: string[] = ["COMMON", "UNCOMMON", "RARE", "LEGENDARY"];
const EQUIPMENT_TYPE: string[] = ["WEAPON", "HELMET", "ARMOR", "SHIELD"];
const AVAILABLE_RARITY_BUSTERPACK: string[] = EQUIPMENT_RARITY.slice(1);
const BUSTERPACK_TYPE = ["USUALLY", "CONSISTENT", "FAIR"];
let DEBUG = 0; // 1 - a lot comments, 0 - less comments

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
    type: string;

    constructor(rarity: string) {
        this.rarity = rarity;
        this.equipment = [];
    }

    // if you are lucky, you may increase you busterpack cards rarity
    // put rarity and return this rarity or higher by 1/2/3 levels
    improveRarity(rarity: string) {
        const indexOfRarity: number = EQUIPMENT_RARITY.indexOf(rarity); // index of rarity
        let item: number = 0;
        const p = Math.random();
        if (DEBUG) console.log("Вам выпала вероятность: ", p);
        if (p < 0.001 && indexOfRarity + 3 < EQUIPMENT_RARITY.length) {
            item = 3;
            if (DEBUG) console.log("Вам супер повезло! Повышение на 3 позиции");
        } else if (p < 0.01 && indexOfRarity + 2 < EQUIPMENT_RARITY.length) {
            item = 2;
            if (DEBUG) console.log("Вам очень повезло! Повышение на 2 позиции");
        } else if (p < 0.1 && indexOfRarity + 1 < EQUIPMENT_RARITY.length) {
            item = 1;
            if (DEBUG) console.log("Вам повезло! Повышение на 1 позицию");
        }
        return EQUIPMENT_RARITY[indexOfRarity + item];
    }


    // get random equipment by definite rarity
    getRandomEquipment(rarity: string) {
        return this.randomInArray(equipments.filter(el => el.rarity === rarity));
    }

    // return random value from array
    randomInArray(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    checkIfAllEqInStore(count: number) {
        const arrEq = [];
        for (let type of EQUIPMENT_TYPE) {
            const eq1 = `${type}_${this.rarity}_1`;
            const eq2 = `${type}_${this.rarity}_2`;
            if (myEq.getEquipmentRarity(this.rarity).map(el => el.eq.name).indexOf(eq1) === -1) arrEq.push(new Equipment(eq1, this.rarity, type));
            if (myEq.getEquipmentRarity(this.rarity).map(el => el.eq.name).indexOf(eq2) === -1) arrEq.push(new Equipment(eq2, this.rarity, type));
        }

        if (myEq.busterpacks[this.rarity + "_" + this.type] + 1 === count) {
            if (arrEq.length) console.log("На бустерпаке №" + count + " не собраны предметы:", arrEq);
            else console.log("На бустерпаке №" + count + " все предметы собраны!");
            return arrEq;
        }
        return [];
    }
}

class UsuallyPack extends BusterPack {
    constructor(rarity: string) {
        super(rarity);
        this.createEquipments();
        this.type = BUSTERPACK_TYPE[0];
        if (DEBUG) console.log("Создали обычный бустерпак:", this.equipment);
    }

    createEquipments() {
        for (let i = 0; i < 5; i++) {
            let rarity: string = (i < 2) ? this.rarity : EQUIPMENT_RARITY[EQUIPMENT_RARITY.indexOf(this.rarity) - 1];
            rarity = this.improveRarity(rarity); // the ability to increase rarity
            const eq: Equipment = this.getRandomEquipment(rarity);
            this.equipment.push(eq);
        }
    }
}

class ConsistentPack extends BusterPack {
    constructor(rarity: string) {
        super(rarity);
        this.createEquipments();
        this.type = BUSTERPACK_TYPE[1];
        if (DEBUG) console.log("Создали consistent бустерпак:", this.equipment);
    }

    // No more than two equipments of the same type
    createEquipments() {
        for (let i = 0; i < 5; i++) {
            let rarity: string = (i < 2) ? this.rarity : EQUIPMENT_RARITY[EQUIPMENT_RARITY.indexOf(this.rarity) - 1];
            rarity = this.improveRarity(rarity); // the ability to increase rarity
            let eq: Equipment = this.getRandomEquipment(rarity);
            let thisTypeCount: number = this.equipment.filter(el => el.type === eq.type).length;

            while (thisTypeCount >= 2) {
                if (DEBUG) console.log("Уже существует два типа: ", eq.type, "в", this.equipment.map(el => el.type));
                eq = this.getRandomEquipment(rarity);
                thisTypeCount = this.equipment.filter(el => el.type === eq.type).length;
            }
            this.equipment.push(eq);
        }
    }
}

class FairPack extends ConsistentPack {
    constructor(rarity: string) {
        super(rarity);
        if (DEBUG) console.log("Создали fair бустерпак:", this.equipment);
        this.type = BUSTERPACK_TYPE[2];
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
            for (let j = 0; j < BUSTERPACK_TYPE.length; j++) {
                this.busterpacks[EQUIPMENT_RARITY[i] + "_" + BUSTERPACK_TYPE[j]] = 0;
            }
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
        textarea.value = "";
        for (let i = 0; i < EQUIPMENT_RARITY.length; i++) {
            if (i !== 0) textarea.value += "\n"
            textarea.value += EQUIPMENT_RARITY[i];
            const arr = this.getEquipmentRarity(EQUIPMENT_RARITY[i]);
            if (arr.length === 8) {
                textarea.value += " (собраны все предметы)";
            }
            textarea.value += "\n";
            for (let j = 0; j < arr.length; j++) {
                textarea.value += `${j + 1}) имя: ${arr[j].eq.name} кол-во: ${arr[j].count} \n`;
            }
        }
    }

    addBusterpack(busterpack: BusterPack) {
        //this.busterpacks[busterpack.rarity] += 1;
        this.busterpacks[busterpack.rarity + "_" + busterpack.type] += 1;
    }

    getCountBusterpack(busterpack: BusterPack) {
        return this.busterpacks[busterpack.rarity];
    }
}

// open buster this definite rarity
function _openBusterpack(busterpack) {
    busterpack.rarity = busterpack.rarity.toUpperCase();
    if (AVAILABLE_RARITY_BUSTERPACK.indexOf(busterpack.rarity) === -1) {
        alert("Такой редкости не существует!");
        return
    }

    console.log("Вам выпал бустерпак:", busterpack, "\n", "ПРЕДМЕТЫ: ", busterpack.equipment.map(el => `${el.rarity} ${el.type}`));

    // if we have fair busterpack we must do check
    if (busterpack.type === BUSTERPACK_TYPE[2]) {
        // take 3 or less unreceived equipment if remain less than 3
        const notEnoughEqPreLast = busterpack.checkIfAllEqInStore(23).slice(0, 3);
        for (let i = 0; i < notEnoughEqPreLast.length; i++) {
            busterpack.equipment[i] = notEnoughEqPreLast[i];
        }
        // take all remain equipment if it 24 busterpack (it count is exactly <= 5)
        const notEnoughEqLast = busterpack.checkIfAllEqInStore(24);
        for (let i = 0; i < notEnoughEqLast.length; i++) {
            busterpack.equipment[i] = notEnoughEqLast[i];
        }
    }
    myEq.addEquipment(busterpack.equipment);
    myEq.showInTextarea();
    myEq.addBusterpack(busterpack);
    // create textarea with busterpack info
    createTextarea(busterpack);
    return busterpack;
}

// open usually busterpack
function openUsuallyBusterpack(rarity: string) {
    (<HTMLInputElement>document.getElementById("fair")).disabled = true;
    (<HTMLInputElement>document.getElementById("many-fair")).disabled = true;
    _openBusterpack(new UsuallyPack(rarity));
}

// open consistent busterpack
function openConsistentBusterpack(rarity: string) {
    (<HTMLInputElement>document.getElementById("fair")).disabled = true;
    (<HTMLInputElement>document.getElementById("many-fair")).disabled = true;
    _openBusterpack(new ConsistentPack(rarity));
}

// open fair busterpack
function openFairBusterpack(rarity: string) {
    (<HTMLInputElement>document.getElementById("usually")).disabled = true;
    (<HTMLInputElement>document.getElementById("consistent")).disabled = true;
    (<HTMLInputElement>document.getElementById("many-consistent")).disabled = true;
    (<HTMLInputElement>document.getElementById("many-usually")).disabled = true;
    (<HTMLInputElement>document.getElementById("select")).disabled = true;
    _openBusterpack(new FairPack(rarity));
}

function createTextarea(busterpack) {
    const textarea = (<HTMLInputElement>document.getElementById("textarea"));
    const oldText = textarea.value;
    textarea.value = busterpack.type + " " + busterpack.rarity +
        " №" + myEq.busterpacks[busterpack.rarity + "_" + busterpack.type] + "\n";
    busterpack.equipment.forEach((el, i) => {
        textarea.value += `${i + 1}) тип: ${el.type.padEnd(6)} редкость: ${el.rarity.padEnd(9)} имя: ${el.name}\n`;
    });
    textarea.value += "\n" + oldText;
}

function _openManyPack(rarity: string, count: number, openBusterpack) {
    if (!count) {
        alert("Введите ненулевое количество!");
        return;
    }

    for (let i = 0; i < count; i++) {
        openBusterpack(rarity);
    }
}

function openManyUsuallyPack(rarity: string, count: number) {
    (<HTMLInputElement>document.getElementById("fair")).disabled = true;
    _openManyPack(rarity, count, openUsuallyBusterpack);
}

function openManyConsistentPack(rarity: string, count: number) {
    (<HTMLInputElement>document.getElementById("fair")).disabled = true;
    _openManyPack(rarity, count, openConsistentBusterpack);
}

function openManyFairPack(rarity: string, count: number) {
    (<HTMLInputElement>document.getElementById("usually")).disabled = true;
    (<HTMLInputElement>document.getElementById("consistent")).disabled = true;
    (<HTMLInputElement>document.getElementById("many-consistent")).disabled = true;
    (<HTMLInputElement>document.getElementById("select")).disabled = true;
    _openManyPack(rarity, count, openFairBusterpack);
}

// create 32 new
const equipments: Equipment[] = [];
for (let type of EQUIPMENT_TYPE) {
    for (let rarity of EQUIPMENT_RARITY) {
        equipments.push(new Equipment(`${type}_${rarity}_1`, rarity, type));
        equipments.push(new Equipment(`${type}_${rarity}_2`, rarity, type));
    }
}
if (DEBUG) console.log("База предметов: ", equipments);
const myEq = new MyEquipment();
