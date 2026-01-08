import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = 'https://uzukwxfolhlcxsomdvre.supabase.co'
const supabaseAnonKey = 'sb_publishable_WoaIMz85jVrcA_K8oooODA_QWzsLykt'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
