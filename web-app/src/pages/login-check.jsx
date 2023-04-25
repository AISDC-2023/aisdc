import { ContainerMobile } from '@/components/ContainerMobile'
import { Heading } from '@/components/Heading'
import { Paragraph } from '@/components/Paragraph'
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth'

export default function LoginCheck() {
  let [status, setStatus] = useState(false)

  // Confirm the link is a sign-in with email link.
  const auth = getAuth()
  if (isSignInWithEmailLink(auth, window.location.href)) {
    // Additional state parameters can also be passed via URL.
    // This can be used to continue the user's intended action before triggering
    // the sign-in operation.
    // Get the email if available. This should be available if the user completes
    // the flow on the same device where they started it.
    let email = window.localStorage.getItem('emailForSignIn')
    if (!email) {
      // User opened the link on a different device. To prevent session fixation
      // attacks, ask the user to provide the associated email again. For example:
      email = window.prompt('Please provide your email for confirmation')
    }
    // The client SDK will parse the code from the link for you.
    signInWithEmailLink(auth, email, window.location.href)
      .then((result) => {
        setStatus(true)
        // TODO: Redirect to the appropriate page based on profile.
        let path = ''
        switch (profile.id) {
          case 'admin':
            path = '/admin?cid=' + cid
            break
          case 'partner':
            path = '/partner?cid=' + cid
            break
          case 'participant':
            path = '/participant?cid=' + cid
            break
          default:
            router.push('/register?cid=' + cid)
        }

        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn')
        // You can access the new user via result.user
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
      })
  }

  return (
    <>
      <ContainerMobile>
        <Heading headerType="h2" className="mt-6">
          {status ? `YOU'RE IN!` : `CHECKING WITH SATELLITE...`}
        </Heading>

        <div className="mt-8">
          <Paragraph className="font-semibold">
            {status ? `Redirecting you now....` : null}
          </Paragraph>
        </div>
      </ContainerMobile>
    </>
  )
}
