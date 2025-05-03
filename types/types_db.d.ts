export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: Database["public"]["Enums"]["action_type"]
          comment_id: number | null
          created_at: string | null
          entity_type: Database["public"]["Enums"]["entity_types"]
          id: string
          ip_address: unknown | null
          metadata: Json | null
          post_id: string | null
          profile_id: string | null
          related_user_id: string | null
          report_id: number | null
          user_id: string
          vote_id: number | null
        }
        Insert: {
          action: Database["public"]["Enums"]["action_type"]
          comment_id?: number | null
          created_at?: string | null
          entity_type: Database["public"]["Enums"]["entity_types"]
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          post_id?: string | null
          profile_id?: string | null
          related_user_id?: string | null
          report_id?: number | null
          user_id: string
          vote_id?: number | null
        }
        Update: {
          action?: Database["public"]["Enums"]["action_type"]
          comment_id?: number | null
          created_at?: string | null
          entity_type?: Database["public"]["Enums"]["entity_types"]
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          post_id?: string | null
          profile_id?: string | null
          related_user_id?: string | null
          report_id?: number | null
          user_id?: string
          vote_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_related_user_id_fkey"
            columns: ["related_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_vote_id_fkey"
            columns: ["vote_id"]
            isOneToOne: false
            referencedRelation: "votes"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          collection_name: string | null
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          collection_name?: string | null
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          collection_name?: string | null
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_avatar_url: string | null
          author_name: string | null
          comment_text: string
          created_at: string
          created_by: string
          id: number
          post: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_name?: string | null
          comment_text: string
          created_at?: string
          created_by: string
          id?: number
          post: string
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string | null
          comment_text?: string
          created_at?: string
          created_by?: string
          id?: number
          post?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_fkey1"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          area: string | null
          created_at: string
          created_by: string
          description: string | null
          id: number
          status: Database["public"]["Enums"]["feedback_status"]
        }
        Insert: {
          area?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          status?: Database["public"]["Enums"]["feedback_status"]
        }
        Update: {
          area?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: number
          status?: Database["public"]["Enums"]["feedback_status"]
        }
        Relationships: [
          {
            foreignKeyName: "feedbacks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: number
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_avatar_url: string | null
          author_name: string
          content: string
          created_at: string
          created_by: string
          downvotes: number
          duration: Database["public"]["Enums"]["post_duration"] | null
          expires_at: string | null
          expires_in_24hr: boolean
          id: string
          is_sensitive: boolean
          mood: Database["public"]["Enums"]["post_mood"]
          upvotes: number
        }
        Insert: {
          author_avatar_url?: string | null
          author_name: string
          content: string
          created_at?: string
          created_by: string
          downvotes?: number
          duration?: Database["public"]["Enums"]["post_duration"] | null
          expires_at?: string | null
          expires_in_24hr?: boolean
          id?: string
          is_sensitive?: boolean
          mood?: Database["public"]["Enums"]["post_mood"]
          upvotes?: number
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string
          content?: string
          created_at?: string
          created_by?: string
          downvotes?: number
          duration?: Database["public"]["Enums"]["post_duration"] | null
          expires_at?: string | null
          expires_in_24hr?: boolean
          id?: string
          is_sensitive?: boolean
          mood?: Database["public"]["Enums"]["post_mood"]
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posttags: {
        Row: {
          created_at: string
          id: number
          post: string
          tag: number
        }
        Insert: {
          created_at?: string
          id?: number
          post: string
          tag: number
        }
        Update: {
          created_at?: string
          id?: number
          post?: string
          tag?: number
        }
        Relationships: [
          {
            foreignKeyName: "posttags_post_fkey"
            columns: ["post"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posttags_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          has_seen_welcome: boolean
          id: string
          is_anonymous: boolean
          is_verified: boolean
          role: Database["public"]["Enums"]["user_role"]
          supabase_user: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          has_seen_welcome?: boolean
          id?: string
          is_anonymous?: boolean
          is_verified?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          supabase_user: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          has_seen_welcome?: boolean
          id?: string
          is_anonymous?: boolean
          is_verified?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          supabase_user?: string
          username?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          comment_id: number | null
          created_at: string | null
          description: string | null
          id: number
          post_id: string | null
          reason: string
          reported_by: string | null
          severity: number | null
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string | null
        }
        Insert: {
          comment_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          post_id?: string | null
          reason: string
          reported_by?: string | null
          severity?: number | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string | null
        }
        Update: {
          comment_id?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          post_id?: string | null
          reason?: string
          reported_by?: string | null
          severity?: number | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          name: string
          post: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          post?: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          post?: number
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          allow_anonymous_replies: boolean | null
          auto_save_drafts: boolean | null
          created_at: string | null
          daily_prompt_enabled: boolean | null
          guided_tour_enabled: boolean | null
          id: string
          mark_sensitive_by_default: boolean | null
          preferred_language: string | null
          privacy: Database["public"]["Enums"]["privacy_options"] | null
          show_sensitive_content: boolean | null
          theme: Database["public"]["Enums"]["theme_options"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allow_anonymous_replies?: boolean | null
          auto_save_drafts?: boolean | null
          created_at?: string | null
          daily_prompt_enabled?: boolean | null
          guided_tour_enabled?: boolean | null
          id?: string
          mark_sensitive_by_default?: boolean | null
          preferred_language?: string | null
          privacy?: Database["public"]["Enums"]["privacy_options"] | null
          show_sensitive_content?: boolean | null
          theme?: Database["public"]["Enums"]["theme_options"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allow_anonymous_replies?: boolean | null
          auto_save_drafts?: boolean | null
          created_at?: string | null
          daily_prompt_enabled?: boolean | null
          guided_tour_enabled?: boolean | null
          id?: string
          mark_sensitive_by_default?: boolean | null
          preferred_language?: string | null
          privacy?: Database["public"]["Enums"]["privacy_options"] | null
          show_sensitive_content?: boolean | null
          theme?: Database["public"]["Enums"]["theme_options"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_verifications: {
        Row: {
          created_at: string
          id: string
          method: Database["public"]["Enums"]["verification_method"]
          reason: string | null
          updated_at: string | null
          user_id: string
          verified: boolean
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["verification_method"]
          reason?: string | null
          updated_at?: string | null
          user_id: string
          verified?: boolean
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          method?: Database["public"]["Enums"]["verification_method"]
          reason?: string | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_verifications_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      views: {
        Row: {
          created_at: string
          id: number
          post_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string
          id: number
          post_id: string
          user_id: string | null
          vote_type: Database["public"]["Enums"]["vote_types"]
        }
        Insert: {
          created_at?: string
          id?: number
          post_id: string
          user_id?: string | null
          vote_type?: Database["public"]["Enums"]["vote_types"]
        }
        Update: {
          created_at?: string
          id?: number
          post_id?: string
          user_id?: string | null
          vote_type?: Database["public"]["Enums"]["vote_types"]
        }
        Relationships: [
          {
            foreignKeyName: "votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_post_with_tags: {
        Args: {
          content: string
          mood: Database["public"]["Enums"]["post_mood"]
          expires_in_24hr: boolean
          duration: Database["public"]["Enums"]["post_duration"]
          expires_at: string
          tag_names: string[]
          is_sensitive: boolean
        }
        Returns: string
      }
      create_post_with_tags_v1: {
        Args: {
          content: string
          mood: Database["public"]["Enums"]["post_mood"]
          expires_in_24hr: boolean
          duration: Database["public"]["Enums"]["post_duration"]
          expires_at: string
          tag_names: string[]
        }
        Returns: string
      }
      handle_vote: {
        Args: {
          p_current_vote: Database["public"]["Enums"]["vote_types"]
          p_post_id: string
          p_user_id: string
          p_vote_type: Database["public"]["Enums"]["vote_types"]
        }
        Returns: Json
      }
    }
    Enums: {
      action_type:
        | "created"
        | "deleted"
        | "updated"
        | "commented"
        | "reported"
        | "upvoted"
        | "downvoted"
        | "viewed"
        | "added"
      entity_types:
        | "post"
        | "comment"
        | "vote"
        | "report"
        | "profile"
        | "system"
        | "view"
      feedback_status: "open" | "closed"
      post_duration: "6" | "12" | "24"
      post_mood: "neutral" | "confused" | "sad" | "happy" | "angry"
      privacy_options: "public" | "private" | "followers_only"
      report_status: "pending" | "reviewed" | "resolved"
      theme_options: "system" | "light" | "dark"
      user_role: "normal_user" | "verified" | "blue_team" | "help_professional"
      verification_method: "manual" | "subscription" | "promo"
      vote_types: "upvote" | "downvote"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

