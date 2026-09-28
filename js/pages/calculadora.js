/* ──────────────────────────────────────────────────────────────────────────
   pages/calculadora.js  ·  Script propio de calculadora.html
   La clase Calculator (máquina de estados de la pantalla) más el
   enganche de los botones. Sin DOM dentro de la clase: recibe sus nodos.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  class Calculator {
    /**
     * Cargamos el objeto calculadora con sus parametros base
     */
    constructor(operand1Element, operand2Element) {
      this.operand1Element = operand1Element;
      this.operand2Element = operand2Element;
      this.clear();
    }

    /**
     * limpieza de pantalla inicial
     */
    clear() {
      this.operand1 = 0;
      this.operand2 = 0;
      this.operator = "";
      this.updateUI();
    }

    /**
     * actualizar los controles del html
     */
    updateUI() {
      this.operand1Element.innerHTML = this.operand1 + this.operator;
      this.operand2Element.innerHTML = this.operand2;
    }

    /**
     * agregar numeros y punto decimal
     * @param {*} number numero o punto decimal agregado
     */
    appendNumber(number) {
      if (number === "." && this.operand2.includes(".")) return;
      this.operand2 =
        this.operand2 === 0 ? number : this.operand2.toString() + number;
      this.updateUI();
    }

    /**
     * borrar numero a numero
     * @returns valor vacio si uno usa mas puntos decimales
     */
    delete() {
      if (this.operand2 === 0) return;
      this.operand2 = +this.operand2.toString().slice(0, -1); //+ convierte a numero el resultado del slice
      this.updateUI();
    }

    /**
     * invoca a los operadores
     * @param {*} operator operador ingresado por el usuario
     */
    operation(operator) {
      if (this.operator) {
        this.calc();
      }
      this.operator = operator;
      this.operand1 = +this.operand2 === 0 ? this.operand1 : this.operand2;
      this.operand2 = 0;
      this.updateUI();
    }

    /**
     * realiza los calculos sobre el operador enviado
     */
    calc() {
      switch (this.operator) {
        case "+":
          this.operand1 = +this.operand1 + +this.operand2;
          break;
        case "-":
          this.operand1 = +this.operand1 - +this.operand2;
          break;
        case "*":
          this.operand1 = +this.operand1 * +this.operand2;
          break;
        case "/":
          this.operand1 = +this.operand1 / +this.operand2;
          break;
      }
      this.operator = "";
      this.operand2 = 0;
      this.updateUI();
    }
  }

  global.Web07.use("pagina:calculadora", {
    Calculator,

    init() {
      const { dom } = global.Web07.mods;

      const operand1Element = dom.$("[data-operand-1]");
      const operand2Element = dom.$("[data-operand-2]");
      if (!operand1Element || !operand2Element) return;

      const calculator = new Calculator(operand1Element, operand2Element);

      /* limpiar la pantalla */
      dom.alClic("[data-clear]", () => calculator.clear());

      /* colocar números y el punto decimal */
      dom.$$("[data-number]").forEach((button) => {
        button.addEventListener("click", () =>
          calculator.appendNumber(button.innerHTML),
        );
      });

      /* borrar el último dígito */
      dom.alClic("[data-delete]", () => calculator.delete());

      /* operadores */
      dom.$$("[data-operation]").forEach((button) => {
        button.addEventListener("click", () =>
          calculator.operation(button.innerHTML),
        );
      });

      /* botón igual */
      dom.alClic("[data-equals]", () => calculator.calc());
    },
  });
})(window);
