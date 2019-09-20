import React, {useEffect} from 'react';
import docs from 'hexogon-docs-data';
import * as examples from 'hexogon-docs-examples';
import {NavBar} from "./components/common/NavBar";
import {PageContent} from "./components/common/PageContent";
import {Page} from "./components/Page";
import { Router } from 'react-router-dom';
import {Routes} from "./components/Routes";
import { createBrowserHistory } from 'history';
import { ReferenceDataContext } from './ReferenceDataContext';
import {colors} from "./colors";

const App: React.FC = () => {
  return (
    <ReferenceDataContext.Provider value={docs.docsData}>
    <Router history={createBrowserHistory()}>
      <Routes />
    </Router>
    </ReferenceDataContext.Provider>
  );
};

export default App;
