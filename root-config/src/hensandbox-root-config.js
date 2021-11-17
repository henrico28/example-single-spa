import { registerApplication, start, addErrorHandler, getAppStatus, LOAD_ERROR } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import microfrontendLayout from "./microfrontend-layout.html";
import { Error } from "./components";

const failedToLoad = (message) => {
  return singleSpaReact({
    React,
    ReactDOM,
    rootComponent: () => <Error message={message} />
  })
}

addErrorHandler(handleError);

function handleError(err) {
  const statusAppsContainer = getAppStatus(err.appOrParcelName)

  console.log("statusApps container", statusAppsContainer)

  console.log("app Name : ", err.appOrParcelName);
  console.log("app message : ", err.message);

  if (getAppStatus(err.appOrParcelName) === LOAD_ERROR) {
    console.log("Deletes the module from the SystemJS registry and re-attempt to download")
    System.delete(System.resolve(err.appOrParcelName));
  }
}

const layoutData = {
  errors: {
    errorHome: failedToLoad("Ini error home.")
  }
}
const routes = constructRoutes(microfrontendLayout, layoutData);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
start();
