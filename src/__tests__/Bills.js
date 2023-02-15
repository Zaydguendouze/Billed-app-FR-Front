/**
 * @jest-environment jsdom
 */
// A verifier!!!!

//
import "@testing-library/jest-dom/extend-expect";
// matchers propre au DOM de jest
import "@testing-library/jest-dom";
// complétion de formulaire et clics de souris etc...
import userEvent from "@testing-library/user-event";

import { screen, waitFor, getAllByTestId } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
//
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      // expect permet d'executer la fonction et de stocker la valeur de retour de cette dernière
      // On veut que l'icone devient selon le css active-icon ou (highlighted)
      expect(windowIcon.className).toBe("active-icon");
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      // Modification de (a < b ? 1 : -1) par (a < b ? 1 : 1)
      const antiChrono = (a, b) => (a > b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    // Tests unitaires

    test("When i navigate on new bill", () => {
      const bills = new Bills({
        document,
        onNavigate: window.onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      buttonNewBill.addEventListener("click", bills.handleClickNewBill);
    });

    // describe("ButtonNewBill", () => {
    //   let component;
    //   // execution avant chaque test
    //   beforeEach(() => {
    //     component = new Bills({
    //       document,
    //       onNavigate: jest.fn(),
    //       store: null,
    //       localStorage: window.localStorage,
    //     });
    //   });

    //   it("Should call the onNavigate function when buttonNewBill is clicked", () => {
    //     component.buttonNewBill.dispatchEvent(new Event("click"));
    //     expect(component.onNavigate).toHaveBeenCalledWith(
    //       ROUTES_PATH["NewBill"]
    //     );
    //   });
    // });

    // describe("IconEye", () => {
    //   let component;
    //   beforeEach(() => {
    //     component = new Bills({
    //       document,
    //       onNavigate: jest.fn(),
    //       store: null,
    //       localStorage: window.localStorage,
    //     });
    //     });
    //   });

    //   it("Should set the billUrl and imgWidth attributes when the iconEye is clicked", () => {
    //     component.iconEye[0].dispatchEvent(new Event("click"));
    //     expect($(".bill-proof-container img").attr("src")).toEqual(
    //       component.iconEye[0].getAttribute("data-bill-url")
    //     );
    //     expect($(".bill-proof-container img").attr("width")).toEqual(
    //       Math.floor($("#modaleFile").width() * 0.5)
    //     );
    //   });
    // });
  });
});
