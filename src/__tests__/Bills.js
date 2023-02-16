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

import { screen, waitFor, getByTestId } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

// mock
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";
// jest.mock
jest.mock("../app/store", () => mockStore);

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

    describe("When i navigate on new bill", () => {
      test("When i click on Nouvelle note de frais", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        // Object.defineProperty(window, "localStorage", {
        //   value: localStorageMock,
        // });
        // window.localStorage.setItem(
        //   "user",
        //   JSON.stringify({
        //     type: "Employee",
        //   })
        // );

        const bills = new Bills({
          document,
          onNavigate,
          // mockStore??
          store: null,
          localStorage: window.localStorage,
        });

        const handleClickNewBill = jest.fn(() => bills.handleClickNewBill());

        const buttonNewBill = screen.getByTestId("btn-new-bill");

        buttonNewBill.addEventListener("click", handleClickNewBill);

        userEvent.click(buttonNewBill);

        expect(handleClickNewBill).toHaveBeenCalled();
      });

      test("When i click on icon eye", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const billsTwo = new Bills({
          document,
          onNavigate,
          // question
          store: mockStore,
          localStorage: window.localStorage,
        });

        const handleClickIconEye = jest.fn((e) =>
          billsTwo.handleClickIconEye(e)
        );

        // getAllByTestId?? forEach...
        const billsTwo = screen.getByTestId("icon-eye");

        billsTwo.forEach((e) => {
          e.addEventListener("click", handleClickIconEye(e));
          userEvent.click(e);
        });
      });
    });
  });
});
