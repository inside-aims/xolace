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
          related_user_avatar_url: string | null
          related_user_id: string | null
          related_username: string | null
          report_id: number | null
          user_avatar_url: string | null
          user_id: string | null
          username: string | null
          video_id: string | null
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
          related_user_avatar_url?: string | null
          related_user_id?: string | null
          related_username?: string | null
          report_id?: number | null
          user_avatar_url?: string | null
          user_id?: string | null
          username?: string | null
          video_id?: string | null
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
          related_user_avatar_url?: string | null
          related_user_id?: string | null
          related_username?: string | null
          report_id?: number | null
          user_avatar_url?: string | null
          user_id?: string | null
          username?: string | null
          video_id?: string | null
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
            foreignKeyName: "activity_logs_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
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
      ai_credits: {
        Row: {
          credits_remaining: number
          last_reset: string
          user_id: string
        }
        Insert: {
          credits_remaining?: number
          last_reset?: string
          user_id: string
        }
        Update: {
          credits_remaining?: number
          last_reset?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      anonymous_messages: {
        Row: {
          posts: any
          can_reshare: boolean
          content: string
          created_at: string
          id: string
          is_read: boolean
          recipient_id: string
          sender_ip_hash: string | null
          shared_at: string | null
        }
        Insert: {
          can_reshare?: boolean
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id: string
          sender_ip_hash?: string | null
          shared_at?: string | null
        }
        Update: {
          can_reshare?: boolean
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          recipient_id?: string
          sender_ip_hash?: string | null
          shared_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anonymous_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      anonymous_messaging_settings: {
        Row: {
          avatar_url: string | null
          background_theme: string
          created_at: string
          custom_prompt: string
          has_min_length: boolean
          min_length: number
          page_title: string
          selected_icon: string
          shareable_slug: string
          show_character_count: boolean
          updated_at: string | null
          user_id: string
          username: string
          welcome_message: string | null
        }
        Insert: {
          avatar_url?: string | null
          background_theme?: string
          created_at?: string
          custom_prompt?: string
          has_min_length?: boolean
          min_length?: number
          page_title?: string
          selected_icon?: string
          shareable_slug: string
          show_character_count?: boolean
          updated_at?: string | null
          user_id: string
          username?: string
          welcome_message?: string | null
        }
        Update: {
          avatar_url?: string | null
          background_theme?: string
          created_at?: string
          custom_prompt?: string
          has_min_length?: boolean
          min_length?: number
          page_title?: string
          selected_icon?: string
          shareable_slug?: string
          show_character_count?: boolean
          updated_at?: string | null
          user_id?: string
          username?: string
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campfire_guide_resources: {
        Row: {
          campfire_id: string
          created_at: string | null
          id: number
          label: string
          sort_order: number | null
          url: string | null
        }
        Insert: {
          campfire_id: string
          created_at?: string | null
          id?: number
          label: string
          sort_order?: number | null
          url?: string | null
        }
        Update: {
          campfire_id?: string
          created_at?: string | null
          id?: number
          label?: string
          sort_order?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campfire_guide_resources_campfire_id_fkey"
            columns: ["campfire_id"]
            isOneToOne: false
            referencedRelation: "campfires"
            referencedColumns: ["id"]
          },
        ]
      }
      campfire_member_permissions: {
        Row: {
          allowed: boolean
          campfire_id: string
          expires_at: string | null
          granted_at: string
          granted_by: string
          notes: string | null
          permission_id: number
          user_id: string
        }
        Insert: {
          allowed?: boolean
          campfire_id: string
          expires_at?: string | null
          granted_at?: string
          granted_by: string
          notes?: string | null
          permission_id: number
          user_id: string
        }
        Update: {
          allowed?: boolean
          campfire_id?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string
          notes?: string | null
          permission_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cmp_campfire_fkey"
            columns: ["campfire_id"]
            isOneToOne: false
            referencedRelation: "campfires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmp_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmp_permission_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "campfire_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmp_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campfire_member_restrictions: {
        Row: {
          campfire_id: string
          created_at: string
          duration_type: Database["public"]["Enums"]["moderation_duration_type"]
          expires_at: string | null
          id: string
          lift_reason: string | null
          lifted_at: string | null
          lifted_by: string | null
          reason: string
          restricted_by: string
          restriction_type: string
          user_id: string
        }
        Insert: {
          campfire_id: string
          created_at?: string
          duration_type: Database["public"]["Enums"]["moderation_duration_type"]
          expires_at?: string | null
          id?: string
          lift_reason?: string | null
          lifted_at?: string | null
          lifted_by?: string | null
          reason: string
          restricted_by: string
          restriction_type: string
          user_id: string
        }
        Update: {
          campfire_id?: string
          created_at?: string
          duration_type?: Database["public"]["Enums"]["moderation_duration_type"]
          expires_at?: string | null
          id?: string
          lift_reason?: string | null
          lifted_at?: string | null
          lifted_by?: string | null
          reason?: string
          restricted_by?: string
          restriction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cmr_campfire_fkey"
            columns: ["campfire_id"]
            isOneToOne: false
            referencedRelation: "campfires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmr_lifted_by_fkey"
            columns: ["lifted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmr_restricted_by_fkey"
            columns: ["restricted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmr_user_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campfire_members: {
        Row: {
          campfire_id: string
          id: string
          is_approved: boolean
          is_favorite: boolean
          joined_at: string
          role: Database["public"]["Enums"]["campfire_role"]
          user_id: string
        }
        Insert: {
          campfire_id: string
          id?: string
          is_approved?: boolean
          is_favorite?: boolean
          joined_at?: string
          role?: Database["public"]["Enums"]["campfire_role"]
          user_id: string
        }
        Update: {
          campfire_id?: string
          id?: string
          is_approved?: boolean
          is_favorite?: boolean
          joined_at?: string
          role?: Database["public"]["Enums"]["campfire_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campfire_members_campfire_id_fkey"
            columns: ["campfire_id"]
            isOneToOne: false
            referencedRelation: "campfires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campfire_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campfire_moderation_logs: {
        Row: {
          action_type: Database["public"]["Enums"]["moderation_action_type"]
          additional_notes: string | null
          campfire_id: string
          created_at: string
          id: string
          metadata: Json | null
          moderator_id: string
          permission_id: number | null
          reason: string
          target_comment_id: number | null
          target_post_id: string | null
          target_user_id: string | null
        }
        Insert: {
          action_type: Database["public"]["Enums"]["moderation_action_type"]
          additional_notes?: string | null
          campfire_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          moderator_id: string
          permission_id?: number | null
          reason: string
          target_comment_id?: number | null
          target_post_id?: string | null
          target_user_id?: string | null
        }
        Update: {
          action_type?: Database["public"]["Enums"]["moderation_action_type"]
          additional_notes?: string | null
          campfire_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          moderator_id?: string
          permission_id?: number | null
          reason?: string
          target_comment_id?: number | null
          target_post_id?: string | null
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cml_campfire_fkey"
            columns: ["campfire_id"]
            isOneToOne: false
            referencedRelation: "campfires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_moderator_fkey"
            columns: ["moderator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_permission_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "campfire_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_target_comment_fkey"
            columns: ["target_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_target_post_fkey"
            columns: ["target_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cml_target_user_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campfire_moderator_invites: {
        Row: {
          accepted_at: string | null
          campfire_id: string
          created_at: string
          declined_at: string | null
          expires_at: string
          id: string
          invitation_message: string | null
          invitee_id: string
          inviter_id: string
          permission_ids: number[]
        }
        Insert: {
          accepted_at?: string | null
          campfire_id: string
          created_at?: string
          declined_at?: string | null
          expires_at: string
          id?: string
          invitation_message?: string | null
          invitee_id: string
          inviter_id: string
          permission_ids: number[]
        }
        Update: {
          accepted_at?: string | null
          campfire_id?: string
          created_at?: string
          declined_at?: string | null
          expires_at?: string
          id?: string
          invitation_message?: string | null
          invitee_id?: string
          inviter_id?: string
          permission_ids?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "cmi_campfire_fkey"
            columns: ["campfire_id"]
            isOneToOne: false
            referencedRelation: "campfires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmi_invitee_fkey"
            columns: ["invitee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cmi_inviter_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campfire_permissions: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: number
          is_active: boolean
          key: string
          permission_group: Database["public"]["Enums"]["campfire_permission"]
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: number
          is_active?: boolean
          key: string
          permission_group: Database["public"]["Enums"]["campfire_permission"]
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: number
          is_active?: boolean
          key?: string
          permission_group?: Database["public"]["Enums"]["campfire_permission"]
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      campfire_rules: {
        Row: {
          campfire_id: string
          created_at: string
          description: string | null
          display_order: number
          id: number
          title: string
        }
        Insert: {
          campfire_id: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: number
          title: string
        }
        Update: {
          campfire_id?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "campfire_rules_campfire_id_fkey"
            columns: ["campfire_id"]
            isOneToOne: false
            referencedRelation: "campfires"
            referencedColumns: ["id"]
          },
        ]
      }
      campfire_settings: {
        Row: {
          auto_remove_expired_restrictions: boolean
          campfire_id: string
          created_at: string
          firekeeper_invite_expiry_days: number
          max_firekeepers: number
          updated_at: string
        }
        Insert: {
          auto_remove_expired_restrictions?: boolean
          campfire_id: string
          created_at?: string
          firekeeper_invite_expiry_days?: number
          max_firekeepers?: number
          updated_at?: string
        }
        Update: {
          auto_remove_expired_restrictions?: boolean
          campfire_id?: string
          created_at?: string
          firekeeper_invite_expiry_days?: number
          max_firekeepers?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campfire_settings_campfire_id_fkey"
            columns: ["campfire_id"]
            isOneToOne: true
            referencedRelation: "campfires"
            referencedColumns: ["id"]
          },
        ]
      }
      campfires: {
        Row: {
          banner_url: string | null
          created_at: string
          created_by: string
          description: string | null
          guide_enabled: boolean | null
          guide_header_image: string | null
          guide_header_layout: string | null
          guide_show_on_join: boolean | null
          guide_welcome_message: string | null
          icon_url: string | null
          id: string
          member_count: number
          name: string
          purpose: Database["public"]["Enums"]["campfire_purpose"]
          slug: string
          updated_at: string
          visibility: Database["public"]["Enums"]["campfire_visibility"]
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          guide_enabled?: boolean | null
          guide_header_image?: string | null
          guide_header_layout?: string | null
          guide_show_on_join?: boolean | null
          guide_welcome_message?: string | null
          icon_url?: string | null
          id?: string
          member_count?: number
          name: string
          purpose?: Database["public"]["Enums"]["campfire_purpose"]
          slug: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["campfire_visibility"]
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          guide_enabled?: boolean | null
          guide_header_image?: string | null
          guide_header_layout?: string | null
          guide_show_on_join?: boolean | null
          guide_welcome_message?: string | null
          icon_url?: string | null
          id?: string
          member_count?: number
          name?: string
          purpose?: Database["public"]["Enums"]["campfire_purpose"]
          slug?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["campfire_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "campfires_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          posts: any
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
          ai_suggestion: boolean
          author_avatar_url: string | null
          author_name: string | null
          campfire_id: string | null
          comment_text: string
          created_at: string
          created_by: string | null
          depth: number
          id: number
          parent_id: number | null
          pinned_status: Database["public"]["Enums"]["comment_pin_type"]
          post: string
        }
        Insert: {
          ai_suggestion?: boolean
          author_avatar_url?: string | null
          author_name?: string | null
          campfire_id?: string | null
          comment_text: string
          created_at?: string
          created_by?: string | null
          depth?: number
          id?: number
          parent_id?: number | null
          pinned_status?: Database["public"]["Enums"]["comment_pin_type"]
          post: string
        }
        Update: {
          ai_suggestion?: boolean
          author_avatar_url?: string | null
          author_name?: string | null
          campfire_id?: string | null
          comment_text?: string
          created_at?: string
          created_by?: string | null
          depth?: number
          id?: number
          parent_id?: number | null
          pinned_status?: Database["public"]["Enums"]["comment_pin_type"]
          post?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_campfire_id_fkey"
            columns: ["campfire_id"]
            isOneToOne: false
            referencedRelation: "campfires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
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
      daily_prompts: {
        Row: {
          active_on: string
          category: string
          created_at: string
          created_by: string
          id: string
          is_active: boolean | null
          prompt_text: string
        }
        Insert: {
          active_on: string
          category?: string
          created_at?: string
          created_by: string
          id?: string
          is_active?: boolean | null
          prompt_text: string
        }
        Update: {
          active_on?: string
          category?: string
          created_at?: string
          created_by?: string
          id?: string
          is_active?: boolean | null
          prompt_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_prompts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedbacks: {
        Row: {
          area: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: number
          status: Database["public"]["Enums"]["feedback_status"]
        }
        Insert: {
          area?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          status?: Database["public"]["Enums"]["feedback_status"]
        }
        Update: {
          area?: string | null
          created_at?: string
          created_by?: string | null
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
      health_professionals: {
        Row: {
          agree_terms: boolean
          bio: string | null
          confirm_accuracy: boolean
          consent_processing: boolean
          consultation_link: string | null
          contact: string | null
          created_at: string | null
          field: string
          id: string
          language: string | null
          license_number: string | null
          location: string | null
          title: string
          understand_review: boolean
          updated_at: string | null
          verified_by_admin: boolean | null
          years_of_experience: number | null
        }
        Insert: {
          agree_terms?: boolean
          bio?: string | null
          confirm_accuracy?: boolean
          consent_processing?: boolean
          consultation_link?: string | null
          contact?: string | null
          created_at?: string | null
          field: string
          id: string
          language?: string | null
          license_number?: string | null
          location?: string | null
          title: string
          understand_review?: boolean
          updated_at?: string | null
          verified_by_admin?: boolean
          years_of_experience: number
        }
        Update: {
          agree_terms?: boolean
          bio?: string | null
          confirm_accuracy?: boolean
          consent_processing?: boolean
          consultation_link?: string | null
          contact?: string | null
          created_at?: string | null
          field?: string
          id?: string
          language?: string | null
          license_number?: string | null
          location?: string | null
          title?: string
          understand_review?: boolean
          updated_at?: string | null
          verified_by_admin?: boolean
          years_of_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "health_professionals_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_tips: {
        Row: {
          author_avatar_url: string | null
          author_name: string
          content: string
          created_at: string
          created_by: string | null
          id: number
          is_approved: boolean
          is_sponsored: boolean
          slug: string
          title: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_name: string
          content: string
          created_at?: string
          created_by?: string | null
          id?: number
          is_approved?: boolean
          is_sponsored?: boolean
          slug: string
          title: string
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string
          content?: string
          created_at?: string
          created_by?: string | null
          id?: number
          is_approved?: boolean
          is_sponsored?: boolean
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_tips_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_tips_tags: {
        Row: {
          created_at: string
          health_tips: number
          id: number
          tags_id: number
        }
        Insert: {
          created_at?: string
          health_tips: number
          id?: number
          tags_id: number
        }
        Update: {
          created_at?: string
          health_tips?: number
          id?: number
          tags_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "health_tips_tags_health_tips_fkey"
            columns: ["health_tips"]
            isOneToOne: false
            referencedRelation: "health_tips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_tips_tags_tags_id_fkey"
            columns: ["tags_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      help_center: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          question: string
          status: Database["public"]["Enums"]["report_status"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          question: string
          status?: Database["public"]["Enums"]["report_status"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          question?: string
          status?: Database["public"]["Enums"]["report_status"]
        }
        Relationships: [
          {
            foreignKeyName: "help center_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      highlighted_feed_content: {
        Row: {
          badge_text: string | null
          campaign_name: string | null
          campaign_type: string | null
          created_at: string
          description: string
          end_date: string
          glimpse_clicks: number
          glimpse_link: string | null
          health_tip_clicks: number
          health_tip_link: string | null
          id: string
          image_url: string
          is_active: boolean
          priority: number
          source_label: string
          start_date: string
          theme_color: string
          title: string
          updated_at: string
        }
        Insert: {
          badge_text?: string | null
          campaign_name?: string | null
          campaign_type?: string | null
          created_at?: string
          description: string
          end_date: string
          glimpse_clicks?: number
          glimpse_link?: string | null
          health_tip_clicks?: number
          health_tip_link?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          priority?: number
          source_label?: string
          start_date: string
          theme_color?: string
          title: string
          updated_at?: string
        }
        Update: {
          badge_text?: string | null
          campaign_name?: string | null
          campaign_type?: string | null
          created_at?: string
          description?: string
          end_date?: string
          glimpse_clicks?: number
          glimpse_link?: string | null
          health_tip_clicks?: number
          health_tip_link?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          priority?: number
          source_label?: string
          start_date?: string
          theme_color?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      notifications: {
        Row: {
          actor_id: string | null
          author_avatar_url: string | null
          author_name: string | null
          created_at: string
          entity_id: string | null
          id: string
          is_read: boolean
          metadata: Json | null
          recipient_user_id: string
          target_type:
            | Database["public"]["Enums"]["notification_target_type"]
            | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          actor_id?: string | null
          author_avatar_url?: string | null
          author_name?: string | null
          created_at?: string
          entity_id?: string | null
          id?: string
          is_read?: boolean
          metadata?: Json | null
          recipient_user_id: string
          target_type?:
            | Database["public"]["Enums"]["notification_target_type"]
            | null
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          actor_id?: string | null
          author_avatar_url?: string | null
          author_name?: string | null
          created_at?: string
          entity_id?: string | null
          id?: string
          is_read?: boolean
          metadata?: Json | null
          recipient_user_id?: string
          target_type?:
            | Database["public"]["Enums"]["notification_target_type"]
            | null
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_user_id_fkey"
            columns: ["recipient_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_slides: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          slide_index: number
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          slide_index: number
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          slide_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_slides_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_avatar_url: string | null
          author_name: string
          author_roles: Database["public"]["Enums"]["user_role"][]
          campfire_id: string | null
          content: string
          created_at: string
          created_by: string | null
          daily_prompt_id: string | null
          downvotes: number
          duration: Database["public"]["Enums"]["post_duration"] | null
          expires_at: string | null
          expires_in_24hr: boolean
          id: string
          is_prompt_response: boolean
          is_reshared_anon_meg: boolean
          is_sensitive: boolean
          mood: Database["public"]["Enums"]["post_mood"]
          type: Database["public"]["Enums"]["post_type"]
          upvotes: number
        }
        Insert: {
          author_avatar_url?: string | null
          author_name: string
          author_roles?: Database["public"]["Enums"]["user_role"][]
          campfire_id?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          daily_prompt_id?: string | null
          downvotes?: number
          duration?: Database["public"]["Enums"]["post_duration"] | null
          expires_at?: string | null
          expires_in_24hr?: boolean
          id?: string
          is_prompt_response?: boolean
          is_reshared_anon_meg?: boolean
          is_sensitive?: boolean
          mood?: Database["public"]["Enums"]["post_mood"]
          type?: Database["public"]["Enums"]["post_type"]
          upvotes?: number
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string
          author_roles?: Database["public"]["Enums"]["user_role"][]
          campfire_id?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          daily_prompt_id?: string | null
          downvotes?: number
          duration?: Database["public"]["Enums"]["post_duration"] | null
          expires_at?: string | null
          expires_in_24hr?: boolean
          id?: string
          is_prompt_response?: boolean
          is_reshared_anon_meg?: boolean
          is_sensitive?: boolean
          mood?: Database["public"]["Enums"]["post_mood"]
          type?: Database["public"]["Enums"]["post_type"]
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_campfire_id_fkey"
            columns: ["campfire_id"]
            isOneToOne: false
            referencedRelation: "campfires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_daily_prompt_id_fkey"
            columns: ["daily_prompt_id"]
            isOneToOne: false
            referencedRelation: "daily_prompts"
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
      professionals_invite_codes: {
        Row: {
          code: string
          created_at: string
          expired: boolean
          expired_at: string | null
          id: number
          professional: string | null
        }
        Insert: {
          code: string
          created_at?: string
          expired?: boolean
          expired_at?: string | null
          id?: number
          professional?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          expired?: boolean
          expired_at?: string | null
          id?: number
          professional?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professionals_invite_codes_professional_fkey"
            columns: ["professional"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          consent_version: number
          created_at: string
          email: string | null
          has_consented: boolean
          has_seen_welcome: boolean
          id: string
          is_anonymous: boolean
          is_verified: boolean
          reputation: number
          role: Database["public"]["Enums"]["user_role"]
          supabase_user: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          consent_version?: number
          created_at?: string
          email?: string | null
          has_consented?: boolean
          has_seen_welcome?: boolean
          id?: string
          is_anonymous?: boolean
          is_verified?: boolean
          reputation?: number
          role?: Database["public"]["Enums"]["user_role"]
          supabase_user: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          consent_version?: number
          created_at?: string
          email?: string | null
          has_consented?: boolean
          has_seen_welcome?: boolean
          id?: string
          is_anonymous?: boolean
          is_verified?: boolean
          reputation?: number
          role?: Database["public"]["Enums"]["user_role"]
          supabase_user?: string
          username?: string
        }
        Relationships: []
      }
      prompt_responses: {
        Row: {
          id: string
          post_id: string
          prompt_id: string
          responded_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          post_id: string
          prompt_id: string
          responded_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          prompt_id?: string
          responded_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_responses_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_responses_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "daily_prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prompt_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_streaks: {
        Row: {
          current_streak: number
          last_response_date: string | null
          longest_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_response_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          last_response_date?: string | null
          longest_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      video_collections: {
        Row: {
          videos: any
          collection_name: string | null
          created_at: string | null
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          collection_name?: string | null
          created_at?: string | null
          id?: string
          user_id: string
          video_id?: string
        }
        Update: {
          collection_name?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_collections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_collections_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_likes: {
        Row: {
          created_at: string
          id: number
          user_id: string | null
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          user_id?: string | null
          video_id: string
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          author_avatar_url: string
          author_name: string
          created_at: string
          description: string
          duration: number | null
          id: string
          likes_count: number
          thumbnail_url: string
          title: string
          updated_at: string
          user_id: string | null
          video_id: string
          video_url: string
          views: number
          visibility: Database["public"]["Enums"]["visibility_options"]
        }
        Insert: {
          author_avatar_url: string
          author_name: string
          created_at?: string
          description: string
          duration?: number | null
          id?: string
          likes_count?: number
          thumbnail_url: string
          title: string
          updated_at?: string
          user_id?: string | null
          video_id: string
          video_url: string
          views?: number
          visibility?: Database["public"]["Enums"]["visibility_options"]
        }
        Update: {
          author_avatar_url?: string
          author_name?: string
          created_at?: string
          description?: string
          duration?: number | null
          id?: string
          likes_count?: number
          thumbnail_url?: string
          title?: string
          updated_at?: string
          user_id?: string | null
          video_id?: string
          video_url?: string
          views?: number
          visibility?: Database["public"]["Enums"]["visibility_options"]
        }
        Relationships: [
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
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
      professionals_public_view: {
        Row: {
          avatar_url: string | null
          bio: string | null
          field: string | null
          id: string | null
          username: string | null
          years_of_experience: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_professionals_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_firekeeper_invitation: {
        Args: { p_invitation_id: string; p_user_id: string }
        Returns: boolean
      }
      create_firekeeper_invitation: {
        Args: {
          p_campfire_id: string
          p_inviter_id: string
          p_invitee_id: string
          p_permission_ids: number[]
          p_invitation_message?: string
        }
        Returns: string
      }
      create_post_with_tags: {
        Args: {
          content: string
          mood: Database["public"]["Enums"]["post_mood"]
          expires_in_24hr: boolean
          duration?: Database["public"]["Enums"]["post_duration"] | null
          expires_at?: string | null
          is_sensitive?: boolean
          is_prompt_response?: boolean
          type?: Database["public"]["Enums"]["post_type"]
          tag_names?: string[]
          slide_contents?: string[]
          campfire_id?: string
          daily_prompt_id?: string
          is_reshared_anon_meg?: boolean
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
      create_post_with_tags_v2: {
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
      create_post_with_tags_v3: {
        Args: {
          content: string
          mood: Database["public"]["Enums"]["post_mood"]
          expires_in_24hr: boolean
          duration: Database["public"]["Enums"]["post_duration"]
          expires_at: string
          tag_names: string[]
          is_sensitive?: boolean
          is_prompt_response?: boolean
        }
        Returns: string
      }
      create_post_with_tags_v4: {
        Args: {
          content: string
          mood: Database["public"]["Enums"]["post_mood"]
          expires_in_24hr: boolean
          duration: Database["public"]["Enums"]["post_duration"]
          expires_at: string
          is_sensitive: boolean
          is_prompt_response: boolean
          tag_names: string[]
          type: Database["public"]["Enums"]["post_type"]
        }
        Returns: string
      }
      create_post_with_tags_v5: {
        Args: {
          content: string
          mood: Database["public"]["Enums"]["post_mood"]
          expires_in_24hr: boolean
          duration?: Database["public"]["Enums"]["post_duration"]
          expires_at?: string
          is_sensitive?: boolean
          is_prompt_response?: boolean
          type?: Database["public"]["Enums"]["post_type"]
          tag_names?: string[]
          slide_contents?: string[]
        }
        Returns: string
      }
      create_post_with_tags_v6: {
        Args: {
          content: string
          mood: Database["public"]["Enums"]["post_mood"]
          expires_in_24hr: boolean
          duration?: Database["public"]["Enums"]["post_duration"]
          expires_at?: string
          is_sensitive?: boolean
          is_prompt_response?: boolean
          type?: Database["public"]["Enums"]["post_type"]
          tag_names?: string[]
          slide_contents?: string[]
          campfire_id?: string
        }
        Returns: string
      }
      create_post_with_tags_v7: {
        Args: {
          content: string
          mood: Database["public"]["Enums"]["post_mood"]
          expires_in_24hr: boolean
          duration?: Database["public"]["Enums"]["post_duration"]
          expires_at?: string
          is_sensitive?: boolean
          is_prompt_response?: boolean
          type?: Database["public"]["Enums"]["post_type"]
          tag_names?: string[]
          slide_contents?: string[]
          campfire_id?: string
          daily_prompt_id?: string
        }
        Returns: string
      }
      get_active_highlighted_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          badge_text: string | null
          campaign_name: string | null
          campaign_type: string | null
          created_at: string
          description: string
          end_date: string
          glimpse_clicks: number
          glimpse_link: string | null
          health_tip_clicks: number
          health_tip_link: string | null
          id: string
          image_url: string
          is_active: boolean
          priority: number
          source_label: string
          start_date: string
          theme_color: string
          title: string
          updated_at: string
        }[]
      }
      get_campfire_approved_users: {
        Args: { p_campfire_id: string }
        Returns: {
          id: string
          username: string
          avatar_url: string
          joined_at: string
          reputation: number
        }[]
      }
      get_campfire_members_by_roles: {
        Args: {
          p_campfire_id: string
          p_roles: Database["public"]["Enums"]["campfire_role"][]
          p_limit?: number
        }
        Returns: {
          user_id: string
          username: string
          avatar_url: string
          role: Database["public"]["Enums"]["campfire_role"]
        }[]
      }
      get_campfire_moderators: {
        Args: { p_campfire_id: string }
        Returns: {
          id: string
          username: string
          avatar_url: string
          role: Database["public"]["Enums"]["campfire_role"]
          joined_at: string
          permission_summary: string
          permission_count: number
          can_edit: boolean
          permissions: Json
        }[]
      }
      get_campfire_moderators_v2: {
        Args: { p_campfire_id: string }
        Returns: {
          id: string
          username: string
          avatar_url: string
          role: Database["public"]["Enums"]["campfire_role"]
          joined_at: string
          permission_summary: string
          permission_count: number
          can_edit: boolean
          permissions: Json
        }[]
      }
      get_campfire_moderators_v3: {
        Args: { p_campfire_id: string }
        Returns: {
          id: string
          username: string
          avatar_url: string
          role: Database["public"]["Enums"]["campfire_role"]
          joined_at: string
          permission_summary: string
          permission_count: number
          can_edit: boolean
          permissions: Json
        }[]
      }
      get_comments_with_replies: {
        Args: { post_id_param: string }
        Returns: {
          ai_suggestion: boolean
          author_avatar_url: string | null
          author_name: string | null
          campfire_id: string | null
          comment_text: string
          created_at: string
          created_by: string | null
          depth: number
          id: number
          parent_id: number | null
          pinned_status: Database["public"]["Enums"]["comment_pin_type"]
          post: string
        }[]
      }
      get_or_create_message_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string | null
          background_theme: string
          created_at: string
          custom_prompt: string
          has_min_length: boolean
          min_length: number
          page_title: string
          selected_icon: string
          shareable_slug: string
          show_character_count: boolean
          updated_at: string | null
          user_id: string
          username: string
          welcome_message: string | null
        }[]
      }
      get_personalized_feed: {
        Args: {
          user_id_param: string
          page_size?: number
          offset_param?: number
        }
        Returns: {
          id: string
          created_at: string
          created_by: string
          author_name: string
          content: string
          mood: Database["public"]["Enums"]["post_mood"]
          author_avatar_url: string
          expires_in_24hr: boolean
          duration: Database["public"]["Enums"]["post_duration"]
          expires_at: string
          downvotes: number
          upvotes: number
          is_sensitive: boolean
          is_prompt_response: boolean
          type: Database["public"]["Enums"]["post_type"]
          author_roles: Database["public"]["Enums"]["user_role"][]
          campfire_id: string
          campfire_name: string
          campfire_slug: string
          campfire_icon_url: string
          daily_prompt_id: string
          prompt_text: string
          prompt_category: string
          priority_score: number
          is_new_post: boolean
          is_campfire_post: boolean
          posttags: Json
          comments_count: number
          views_count: number
          collections: Json
          post_slides: Json
        }[]
      }
      get_personalized_feed_v1: {
        Args: {
          user_id_param: string
          page_size?: number
          offset_param?: number
        }
        Returns: {
          id: string
          created_at: string
          created_by: string
          author_name: string
          content: string
          mood: Database["public"]["Enums"]["post_mood"]
          author_avatar_url: string
          expires_in_24hr: boolean
          duration: Database["public"]["Enums"]["post_duration"]
          expires_at: string
          downvotes: number
          upvotes: number
          is_sensitive: boolean
          is_prompt_response: boolean
          type: Database["public"]["Enums"]["post_type"]
          author_roles: Database["public"]["Enums"]["user_role"][]
          campfire_id: string
          campfire_name: string
          campfire_slug: string
          campfire_icon_url: string
          priority_score: number
          is_new_post: boolean
          is_campfire_post: boolean
          posttags: Json
          comments_count: number
          views_count: number
          collections: Json
          post_slides: Json
        }[]
      }
      get_personalized_feed_v2: {
        Args: {
          user_id_param: string
          page_size?: number
          offset_param?: number
        }
        Returns: {
          id: string
          created_at: string
          created_by: string
          author_name: string
          content: string
          mood: Database["public"]["Enums"]["post_mood"]
          author_avatar_url: string
          expires_in_24hr: boolean
          duration: Database["public"]["Enums"]["post_duration"]
          expires_at: string
          downvotes: number
          upvotes: number
          is_sensitive: boolean
          is_prompt_response: boolean
          type: Database["public"]["Enums"]["post_type"]
          author_roles: Database["public"]["Enums"]["user_role"][]
          campfire_id: string
          campfire_name: string
          campfire_slug: string
          campfire_icon_url: string
          daily_prompt_id: string
          prompt_text: string
          prompt_category: string
          priority_score: number
          is_new_post: boolean
          is_campfire_post: boolean
          posttags: Json
          comments_count: number
          views_count: number
          collections: Json
          post_slides: Json
        }[]
      }
      get_user_campfire_permissions: {
        Args: { p_campfire_id: string }
        Returns: {
          permission_key: string
          display_name: string
          permission_group: string
        }[]
      }
      get_user_stats: {
        Args: { profile_id: string }
        Returns: {
          total_posts: number
          total_comments: number
          total_upvotes: number
          total_views: number
          total_downvotes: number
        }[]
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
      handle_vote_v1: {
        Args: {
          p_current_vote: Database["public"]["Enums"]["vote_types"]
          p_post_id: string
          p_user_id: string
          p_vote_type: Database["public"]["Enums"]["vote_types"]
        }
        Returns: Json
      }
      has_campfire_permission: {
        Args: {
          p_campfire_id: string
          p_user_id: string
          p_permission_key: string
        }
        Returns: boolean
      }
      increment_reputation: {
        Args: { user_id_in: string; points_in: number }
        Returns: undefined
      }
      insert_health_tip_with_tags: {
        Args: {
          p_title: string
          p_content: string
          p_created_by: string
          p_author_name: string
          p_author_avatar_url: string
          p_tags: string[]
          p_slug: string
        }
        Returns: {
          id: number
        }[]
      }
      is_active_campfire_member: {
        Args: { p_campfire_id: string; p_user_id: string }
        Returns: boolean
      }
      mark_all_notifications_as_read: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      mark_notification_as_read: {
        Args: { notification_id: string }
        Returns: undefined
      }
      pin_comment: {
        Args: {
          comment_id_to_pin: number
          pin_level: Database["public"]["Enums"]["comment_pin_type"]
        }
        Returns: undefined
      }
      reset_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      search_profiles_for_invite: {
        Args: { p_search_term: string }
        Returns: {
          id: string
          username: string
          avatar_url: string
          created_at: string
          reputation: number
        }[]
      }
      track_highlight_click: {
        Args: { p_highlight_id: string; p_click_type: string }
        Returns: undefined
      }
      upsert_tags_and_tips_relationship: {
        Args: { tag_names: string[]; tips_id: number }
        Returns: undefined
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
        | "liked"
      campfire_permission: "manage_config" | "manage_content" | "manage_users"
      campfire_purpose:
        | "support_circle"
        | "growth_group"
        | "creative_outlet"
        | "general_discussion"
      campfire_role: "camper" | "firekeeper" | "firestarter"
      campfire_visibility: "public" | "restricted" | "private" | "secret"
      comment_pin_type: "none" | "author" | "professional"
      entity_types:
        | "post"
        | "comment"
        | "vote"
        | "report"
        | "profile"
        | "system"
        | "view"
        | "video"
        | "campfire"
      feedback_status: "open" | "closed"
      moderation_action_type:
        | "ban_user_temporary"
        | "ban_user_permanent"
        | "unban_user"
        | "mute_user_temporary"
        | "mute_user_permanent"
        | "unmute_user"
        | "remove_member"
        | "delete_post"
        | "remove_post"
        | "restore_post"
        | "delete_comment"
        | "remove_comment"
        | "restore_comment"
        | "pin_comment"
        | "unpin_comment"
        | "grant_permission"
        | "revoke_permission"
      moderation_duration_type: "temporary" | "permanent"
      notification_target_type:
        | "single_user"
        | "role_based"
        | "all_users"
        | "new_users"
      notification_type:
        | "new_upvote"
        | "new_downvote"
        | "new_comment"
        | "post_saved"
        | "video_saved"
        | "video_liked"
        | "system_announcement"
        | "post_viewed"
        | "comment_reply"
        | "joined_campfire"
        | "leave_campfire"
        | "firekeeper_invitation"
      post_duration: "6" | "12" | "24"
      post_mood:
        | "neutral"
        | "confused"
        | "sad"
        | "happy"
        | "angry"
        | "thoughtful"
        | "chill"
        | "grateful"
        | "laughing"
        | "inspired"
        | "peaceful"
        | "melancholy"
        | "creative"
        | "nostalgic"
        | "motivated"
        | "excited"
        | "energetic"
      post_type: "single" | "carousel"
      privacy_options: "public" | "private" | "followers_only"
      report_status: "pending" | "reviewed" | "resolved"
      theme_options: "system" | "light" | "dark"
      user_role:
        | "normal_user"
        | "verified"
        | "blue_team"
        | "help_professional"
        | "mentor"
      verification_method: "manual" | "subscription" | "promo"
      visibility_options: "public" | "private"
      vote_types: "upvote" | "downvote"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      action_type: [
        "created",
        "deleted",
        "updated",
        "commented",
        "reported",
        "upvoted",
        "downvoted",
        "viewed",
        "added",
        "liked",
      ],
      campfire_permission: ["manage_config", "manage_content", "manage_users"],
      campfire_purpose: [
        "support_circle",
        "growth_group",
        "creative_outlet",
        "general_discussion",
      ],
      campfire_role: ["camper", "firekeeper", "firestarter"],
      campfire_visibility: ["public", "restricted", "private", "secret"],
      comment_pin_type: ["none", "author", "professional"],
      entity_types: [
        "post",
        "comment",
        "vote",
        "report",
        "profile",
        "system",
        "view",
        "video",
        "campfire",
      ],
      feedback_status: ["open", "closed"],
      moderation_action_type: [
        "ban_user_temporary",
        "ban_user_permanent",
        "unban_user",
        "mute_user_temporary",
        "mute_user_permanent",
        "unmute_user",
        "remove_member",
        "delete_post",
        "remove_post",
        "restore_post",
        "delete_comment",
        "remove_comment",
        "restore_comment",
        "pin_comment",
        "unpin_comment",
        "grant_permission",
        "revoke_permission",
      ],
      moderation_duration_type: ["temporary", "permanent"],
      notification_target_type: [
        "single_user",
        "role_based",
        "all_users",
        "new_users",
      ],
      notification_type: [
        "new_upvote",
        "new_downvote",
        "new_comment",
        "post_saved",
        "video_saved",
        "video_liked",
        "system_announcement",
        "post_viewed",
        "comment_reply",
        "joined_campfire",
        "leave_campfire",
        "firekeeper_invitation",
      ],
      post_duration: ["6", "12", "24"],
      post_mood: [
        "neutral",
        "confused",
        "sad",
        "happy",
        "angry",
        "thoughtful",
        "chill",
        "grateful",
        "laughing",
        "inspired",
        "peaceful",
        "melancholy",
        "creative",
        "nostalgic",
        "motivated",
        "excited",
        "energetic",
      ],
      post_type: ["single", "carousel"],
      privacy_options: ["public", "private", "followers_only"],
      report_status: ["pending", "reviewed", "resolved"],
      theme_options: ["system", "light", "dark"],
      user_role: [
        "normal_user",
        "verified",
        "blue_team",
        "help_professional",
        "mentor",
      ],
      verification_method: ["manual", "subscription", "promo"],
      visibility_options: ["public", "private"],
      vote_types: ["upvote", "downvote"],
    },
  },
} as const

