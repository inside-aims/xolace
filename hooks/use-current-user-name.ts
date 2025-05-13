import { useUserState } from '@/lib/store/user'

export const useCurrentUserName = () => {
   // get user profile data
   const user = useUserState(state => state.user);

  // useEffect(() => {
  //   const fetchProfileName = async () => {
  //     const { data, error } = await createClient().auth.getSession()
  //     if (error) {
  //       console.error(error)
  //     }

  //     setName(data.session?.user.user_metadata.full_name ?? '?')
  //   }

  //   fetchProfileName()
  // }, [])

  return user?.username || '?'
}
