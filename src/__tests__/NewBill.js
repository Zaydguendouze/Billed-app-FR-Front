/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

import BillsUI from "../views/BillsUI.js";
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

// mock
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";
// jest.mock
jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ", async () => {
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
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      //to-do write expect expression
      // expect permet d'executer la fonction et de stocker la valeur de retour de cette dernière
      // On veut que l'icone devient selon le css active-icon ou (highlighted)
      expect(mailIcon.className).toBe("active-icon");
    });
    test("when a new file is selected and changed", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const html = NewBillUI();
      document.body.innerHTML = html;
      //to-do write assertion
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const title = screen.getAllByText("Envoyer une note de frais");
      expect(title).toBeTruthy();

      const handleChangeFile = jest.fn(newBill.handleChangeFile);

      const input = screen.getByTestId("file");

      input.addEventListener("change", handleChangeFile);

      fireEvent.change(input, {
        target: {
          files: [new File(["test.jpg"], "test.jpg", { type: "image/jpg" })],
        },
      });

      expect(handleChangeFile).toHaveBeenCalled();
      expect(input.files[0].name).toBe("test.jpg");
    });
  });
  // describe("Test", () => {
  // })
});
