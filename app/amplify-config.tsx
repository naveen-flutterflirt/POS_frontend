'use client';

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_5d3RCaS6A',
      userPoolClientId: '4613o9ialn0hfn4c9pofr6s7tr',
    },
  },
});

// This component renders nothing — it only triggers Amplify configuration on the client side.
export default function AmplifyConfigProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
