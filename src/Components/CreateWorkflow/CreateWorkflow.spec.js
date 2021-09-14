import React from "react";
import CreateWorkflow from ".";
import { fireEvent } from "@testing-library/react";
import { queryCaches } from "react-query";
import { teams, profile } from "ApiServer/fixtures";
import { AppContextProvider } from "State/context";

afterEach(() => {
  queryCaches.forEach((queryCache) => queryCache.clear());
});

const props = {
  team: teams[0],
  teams: teams,
};

describe("CreateWorkflow --- Snapshot Test", () => {
  test("Capturing Snapshot of CreateWorkflow", () => {
    const { baseElement, getByText } = rtlContextRouterRender(
      <AppContextProvider
        value={{
          isTutorialActive: false,
          setIsTutorialActive: () => {},
          user: profile,
          teams,
        }}
      >
        <CreateWorkflow {...props} />{" "}
      </AppContextProvider>
    );
    fireEvent.click(getByText(/Create a new workflow/i));
    expect(baseElement).toMatchSnapshot();
  });
});
