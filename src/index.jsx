import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import Home from './components/Home';
import Error from './components/Error';
import GlobalStyle from './utils/GlobalStyle';
import { BrowserRouter as Router ,Routes,Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from '../src/appoloClient';
import Faculty from './components/Faculties';
import Degree from './components/Degrees';
import School from './components/Schools';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <GlobalStyle />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/facultes' element={<Faculty/>}/>
          <Route path="/degrees" element={<Degree />} />
          <Route path="/schools" element={<School />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
