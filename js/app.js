const EMPTY_ARRAY = [];

class Register {

  constructor(data) {
    this.data = data;
  }

  get(index) {
    return this.data[index];
  }

  set(index, value) {
    this.data[index] = value;
  }

  size() {
    return this.data.length;
  }

  getData() {
    return this.data;
  }

}

class StatusRegister extends Register {

  getBitCarry() {
    return this.data[0];
  }

  setBitCarry(value) {
    this.data[0] = value;
  }

}

class AluAbstractUnaryRegister {

  constructor() {
  }

  alu(r1) {
    throw new Error("This method is not implemented");
  }

  computation(a) {
  }

}

class NotAluUnaryRegister extends  AluAbstractUnaryRegister {

  constructor() {
    super();
  }

  alu(r1) {
    let arrayResult = EMPTY_ARRAY;

    for(let i = r1.size() - 1; i >= 0; i--) {
      let value = r1.get(i);
      arrayResult.push(
        this.computation(value));
    }

    arrayResult.reverse();
    return new Register(arrayResult);
  }

  computation(a) {
    return a === 0 ? 1 : 0;
  }

}

class AluAbstractRegister {

  constructor() {
  }

  alu(r1, r2) {
    throw new Error("This method is not implemented.");
  }

  computation(a, b) {
    throw new Error("This method is not implemented.");
  }

}

class XorAluRegister extends AluAbstractRegister {

  constructor() {
    super();
  }

  alu(r1, r2) {
    let arrayResult = [];

    for (let i = r1.size() - 1; i >= 0; i--) {
      let result = this.computation(
        r1.get(i),
        r2.get(i)
      );

      arrayResult.push(result);
    }

    arrayResult.reverse();
    return new Register(arrayResult);
  }

  computation(a, b) {
    if (a === 0 && b === 0
      || a === 1 && b === 1) {
      return 0;
    }
    return 1;
  }

}

class SumAluRegister extends AluAbstractRegister {

  constructor(statusRegister) {
    super();
    this.statusRegister = statusRegister;
  }

  alu(r1, r2) {
    let arrayResult = EMPTY_ARRAY;

    for (let i = r1.size() - 1; i >= 0; i--) {

      let result = this.computation(
        r1.get(i),
        r2.get(i)
      );

      arrayResult.push(result);
    }

    arrayResult.reverse();
    return new Register(arrayResult);
  }

  computation(a, b) {

    if (this.statusRegister.getBitCarry() === 0) {

      if (a === 1 && b === 1) {
        this.statusRegister.setBitCarry(1);
        return 0;
      }

      return a + b;
    }

    if (a === 1 && b === 1) {
      this.statusRegister.setBitCarry(1);
      return 1;
    }

    if (a === 1 && b === 0
      || b === 1 && a === 0) {
      this.statusRegister.setBitCarry(1);
      return 0;
    }

    this.statusRegister.setBitCarry(0);
    return 1;
  }

}

/*let registerAcc = new Register([0, 0, 0, 0, 0, 1, 0, 1]);
let registerAux = new Register([0, 0, 0, 0, 0, 1, 1, 1]);
let registerRMDAT = new Register(EMPTY_ARRAY);
let registerRMDIR = new Register(EMPTY_ARRAY);
let registerStatus = new StatusRegister([0, 0, 0, 0, 0, 0, 0, 0]);
*/

let registers = {
  "acc": new Register([0, 0, 0, 0, 0, 1, 0, 1]),
  "aux": new Register([0, 0, 0, 0, 0, 1, 1, 1]),
  "rmdat":  new Register(EMPTY_ARRAY),
  "rmdir": new Register(EMPTY_ARRAY),
  "status": new StatusRegister([0, 0, 0, 0, 0, 0, 0, 0]),
};

function writeRegister(register, div) {
  const paragraphs = div.getElementsByTagName('p');
  for (let i = 0; i < 8; i++) {
    let paragraph = paragraphs[i];
    paragraph.innerText = register.get(i);
  }

}

document.addEventListener('DOMContentLoaded', () => {
  let accDiv = document.getElementById('acc');
  let auxDiv = document.getElementById('aux');

  let registerAcc = registers['acc'];
  let registerAux = registers['aux'];

  writeRegister(
    registerAcc,
    accDiv
  );

  writeRegister(
    registerAux,
    auxDiv
  );

});

function xor() {
  let accDiv = document.getElementById('acc');
  let registerAux = registers['aux'];
  let registerAcc = registers['acc'];

  let xorAlu = new XorAluRegister();

  registerAcc = xorAlu.alu(
    registerAux,
    registerAcc
  );

  registers['acc'] = registerAcc;
  writeRegister(registerAcc, accDiv);
}

function sum() {
  let accDiv = document.getElementById('acc');
  let registerAux = registers['aux'];
  let registerAcc = registers['acc'];
  let registerStatus = registers['status'];

  let sumAlu = new SumAluRegister(registerStatus);


  registerAcc = sumAlu.alu(
    registerAcc,
    registerAux
  );

  registers['acc'] = registerAcc;
  writeRegister(registerAcc, accDiv);

}

function not() {
  let accDiv = document.getElementById('acc');
  let registerAux = registers['aux'];

  let notAlu = new NotAluUnaryRegister();

  registers['acc'] = notAlu.alu(registerAux);
  let registerAcc = registers['acc'];


  writeRegister(registerAcc, accDiv);
}

function transferFromButton() {
  let selectedItemForMove = document.getElementById('e-manager-element-for-move');
  let nameRegisterForMove = selectedItemForMove[selectedItemForMove.selectedIndex].value;

  let selectedItemWhereMove  = document.getElementById('e-manager-element-where-move');
  let nameRegisterWhereMove = selectedItemWhereMove[selectedItemWhereMove.selectedIndex].value;

  if(nameRegisterWhereMove === nameRegisterForMove) {
    alert("The registers are the same.");
    return;
  }

  transfer(nameRegisterWhereMove,
    nameRegisterForMove);
}

function transfer(nameRegisterWhereMove,
                  nameRegisterForMove) {

  let registerForMove = registers[nameRegisterForMove];
  let div = document.getElementById(nameRegisterWhereMove);

  registers[nameRegisterWhereMove] = registerForMove;
  writeRegister(registers[nameRegisterWhereMove], div);

}
