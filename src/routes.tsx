import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

const SignerPage = React.lazy(() => import('./pages/signer/Signer'));
const VerifierPage = React.lazy(() => import('./pages/verifier/Verifier'));

export default function Routes() {
  return (
    <Switch>
      <Route path="/signer" exact component={SignerPage} />
      <Route path="/verifier" exact component={VerifierPage} />
      <Redirect from="/" to="/signer" />
    </Switch>
  );
}
