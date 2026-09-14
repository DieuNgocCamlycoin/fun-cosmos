export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      fun_cosmos_audit_events: {
        Row: {
          action: string
          actor_type: string
          actor_user_id: string | null
          created_at: string
          id: string
          new_status: string | null
          note: string | null
          old_status: string | null
          reward_id: string | null
          submission_id: string | null
        }
        Insert: {
          action: string
          actor_type: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          new_status?: string | null
          note?: string | null
          old_status?: string | null
          reward_id?: string | null
          submission_id?: string | null
        }
        Update: {
          action?: string
          actor_type?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          new_status?: string | null
          note?: string | null
          old_status?: string | null
          reward_id?: string | null
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fun_cosmos_audit_events_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "fun_cosmos_rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fun_cosmos_audit_events_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "fun_cosmos_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      fun_cosmos_participants: {
        Row: {
          created_at: string
          fun_id: string | null
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          fun_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          fun_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      fun_cosmos_rate_limits: {
        Row: {
          action: string
          created_at: string
          fingerprint_hash: string
          id: number
        }
        Insert: {
          action: string
          created_at?: string
          fingerprint_hash: string
          id?: never
        }
        Update: {
          action?: string
          created_at?: string
          fingerprint_hash?: string
          id?: never
        }
        Relationships: []
      }
      fun_cosmos_rewards: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          campaign_code: string
          created_at: string
          id: string
          notes: string | null
          participant_id: string
          reward_amount: number
          reward_type: string
          sent_at: string | null
          status: Database["public"]["Enums"]["fun_cosmos_reward_status"]
          submission_id: string
          token_symbol: string
          tx_hash: string | null
          updated_at: string
          wallet_address: string
          wallet_normalized: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          campaign_code: string
          created_at?: string
          id?: string
          notes?: string | null
          participant_id: string
          reward_amount?: number
          reward_type?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["fun_cosmos_reward_status"]
          submission_id: string
          token_symbol?: string
          tx_hash?: string | null
          updated_at?: string
          wallet_address: string
          wallet_normalized: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          campaign_code?: string
          created_at?: string
          id?: string
          notes?: string | null
          participant_id?: string
          reward_amount?: number
          reward_type?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["fun_cosmos_reward_status"]
          submission_id?: string
          token_symbol?: string
          tx_hash?: string | null
          updated_at?: string
          wallet_address?: string
          wallet_normalized?: string
        }
        Relationships: [
          {
            foreignKeyName: "fun_cosmos_rewards_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "fun_cosmos_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fun_cosmos_rewards_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "fun_cosmos_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      fun_cosmos_submissions: {
        Row: {
          admin_note: string | null
          angel_ai_support: string
          campaign_code: string
          character: string
          consent_accuracy: boolean
          consent_public: boolean
          created_at: string
          desired_reward_or_progress: string
          display_name: string
          dream: string
          duplicate_flag: boolean
          duplicate_reasons: string[]
          email: string
          email_normalized: string
          facebook_normalized: string
          facebook_url: string
          fun_id: string | null
          fun_rich_url: string | null
          gameplay: string
          id: string
          participant_id: string
          participant_message: string | null
          public_submission_code: string
          real_world_connection: string
          status: Database["public"]["Enums"]["fun_cosmos_submission_status"]
          submitted_at: string
          telegram: string
          telegram_normalized: string
          updated_at: string
          user_id: string | null
          wallet_address: string
          wallet_normalized: string
          world_change: string
        }
        Insert: {
          admin_note?: string | null
          angel_ai_support: string
          campaign_code?: string
          character: string
          consent_accuracy: boolean
          consent_public?: boolean
          created_at?: string
          desired_reward_or_progress: string
          display_name: string
          dream: string
          duplicate_flag?: boolean
          duplicate_reasons?: string[]
          email: string
          email_normalized: string
          facebook_normalized: string
          facebook_url: string
          fun_id?: string | null
          fun_rich_url?: string | null
          gameplay: string
          id?: string
          participant_id: string
          participant_message?: string | null
          public_submission_code: string
          real_world_connection: string
          status?: Database["public"]["Enums"]["fun_cosmos_submission_status"]
          submitted_at?: string
          telegram: string
          telegram_normalized: string
          updated_at?: string
          user_id?: string | null
          wallet_address: string
          wallet_normalized: string
          world_change: string
        }
        Update: {
          admin_note?: string | null
          angel_ai_support?: string
          campaign_code?: string
          character?: string
          consent_accuracy?: boolean
          consent_public?: boolean
          created_at?: string
          desired_reward_or_progress?: string
          display_name?: string
          dream?: string
          duplicate_flag?: boolean
          duplicate_reasons?: string[]
          email?: string
          email_normalized?: string
          facebook_normalized?: string
          facebook_url?: string
          fun_id?: string | null
          fun_rich_url?: string | null
          gameplay?: string
          id?: string
          participant_id?: string
          participant_message?: string | null
          public_submission_code?: string
          real_world_connection?: string
          status?: Database["public"]["Enums"]["fun_cosmos_submission_status"]
          submitted_at?: string
          telegram?: string
          telegram_normalized?: string
          updated_at?: string
          user_id?: string | null
          wallet_address?: string
          wallet_normalized?: string
          world_change?: string
        }
        Relationships: [
          {
            foreignKeyName: "fun_cosmos_submissions_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "fun_cosmos_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_audit_events: {
        Row: {
          action: string
          actor_type: string
          actor_user_id: string | null
          created_at: string
          id: string
          idea_id: string | null
          new_status: string | null
          note: string | null
          old_status: string | null
        }
        Insert: {
          action: string
          actor_type: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          idea_id?: string | null
          new_status?: string | null
          note?: string | null
          old_status?: string | null
        }
        Update: {
          action?: string
          actor_type?: string
          actor_user_id?: string | null
          created_at?: string
          id?: string
          idea_id?: string | null
          new_status?: string | null
          note?: string | null
          old_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "idea_audit_events_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_private_details: {
        Row: {
          consent_accuracy: boolean
          consent_public: boolean
          created_at: string
          email: string
          facebook_url: string
          fun_rich_url: string
          idea_id: string
          recipient_wallet: string
          telegram: string
          updated_at: string
        }
        Insert: {
          consent_accuracy?: boolean
          consent_public?: boolean
          created_at?: string
          email?: string
          facebook_url?: string
          fun_rich_url?: string
          idea_id: string
          recipient_wallet?: string
          telegram?: string
          updated_at?: string
        }
        Update: {
          consent_accuracy?: boolean
          consent_public?: boolean
          created_at?: string
          email?: string
          facebook_url?: string
          fun_rich_url?: string
          idea_id?: string
          recipient_wallet?: string
          telegram?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_private_details_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: true
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_tags: {
        Row: {
          created_at: string
          id: string
          idea_id: string
          tag: string
        }
        Insert: {
          created_at?: string
          id?: string
          idea_id: string
          tag: string
        }
        Update: {
          created_at?: string
          id?: string
          idea_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_tags_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          admin_note: string | null
          angel_ai: string
          category: Database["public"]["Enums"]["idea_category"]
          character_description: string
          character_name: string
          cover_image_url: string | null
          created_at: string
          creator_display_name_snapshot: string
          creator_message: string | null
          creator_user_id: string
          dream: string
          duplicate_flag: boolean
          duplicate_reasons: string[]
          gameplay: string
          id: string
          public_code: string | null
          published_at: string | null
          real_world_connection: string
          reward: string
          reward_amount: number
          reward_chain: string
          reward_contract: string
          reward_status: Database["public"]["Enums"]["idea_reward_status"]
          reward_token: string
          reward_tx_hash: string | null
          rewarded_at: string | null
          rewarded_by: string | null
          status: Database["public"]["Enums"]["idea_status"]
          submitted_at: string | null
          summary: string
          title: string
          updated_at: string
          world_change: string
        }
        Insert: {
          admin_note?: string | null
          angel_ai?: string
          category?: Database["public"]["Enums"]["idea_category"]
          character_description?: string
          character_name?: string
          cover_image_url?: string | null
          created_at?: string
          creator_display_name_snapshot?: string
          creator_message?: string | null
          creator_user_id: string
          dream?: string
          duplicate_flag?: boolean
          duplicate_reasons?: string[]
          gameplay?: string
          id?: string
          public_code?: string | null
          published_at?: string | null
          real_world_connection?: string
          reward?: string
          reward_amount?: number
          reward_chain?: string
          reward_contract?: string
          reward_status?: Database["public"]["Enums"]["idea_reward_status"]
          reward_token?: string
          reward_tx_hash?: string | null
          rewarded_at?: string | null
          rewarded_by?: string | null
          status?: Database["public"]["Enums"]["idea_status"]
          submitted_at?: string | null
          summary?: string
          title?: string
          updated_at?: string
          world_change?: string
        }
        Update: {
          admin_note?: string | null
          angel_ai?: string
          category?: Database["public"]["Enums"]["idea_category"]
          character_description?: string
          character_name?: string
          cover_image_url?: string | null
          created_at?: string
          creator_display_name_snapshot?: string
          creator_message?: string | null
          creator_user_id?: string
          dream?: string
          duplicate_flag?: boolean
          duplicate_reasons?: string[]
          gameplay?: string
          id?: string
          public_code?: string | null
          published_at?: string | null
          real_world_connection?: string
          reward?: string
          reward_amount?: number
          reward_chain?: string
          reward_contract?: string
          reward_status?: Database["public"]["Enums"]["idea_reward_status"]
          reward_token?: string
          reward_tx_hash?: string | null
          rewarded_at?: string | null
          rewarded_by?: string | null
          status?: Database["public"]["Enums"]["idea_status"]
          submitted_at?: string | null
          summary?: string
          title?: string
          updated_at?: string
          world_change?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      next_idea_public_code: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "admin"
      fun_cosmos_reward_status:
        | "pending"
        | "eligible"
        | "approved"
        | "processing"
        | "sent"
        | "failed"
        | "cancelled"
      fun_cosmos_submission_status:
        | "submitted"
        | "under_review"
        | "needs_revision"
        | "approved"
        | "rejected"
      idea_category:
        | "world"
        | "gameplay"
        | "story"
        | "character"
        | "art"
        | "music"
        | "ai"
        | "code"
        | "green_earth"
        | "lovehub"
        | "learning"
        | "other"
      idea_reward_status:
        | "not_selected"
        | "eligible"
        | "approved"
        | "reward_pending"
        | "rewarded"
        | "reward_failed"
      idea_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "needs_revision"
        | "published"
        | "selected"
        | "in_development"
        | "prototype"
        | "playtest"
        | "implemented"
        | "archived"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin"],
      fun_cosmos_reward_status: [
        "pending",
        "eligible",
        "approved",
        "processing",
        "sent",
        "failed",
        "cancelled",
      ],
      fun_cosmos_submission_status: [
        "submitted",
        "under_review",
        "needs_revision",
        "approved",
        "rejected",
      ],
      idea_category: [
        "world",
        "gameplay",
        "story",
        "character",
        "art",
        "music",
        "ai",
        "code",
        "green_earth",
        "lovehub",
        "learning",
        "other",
      ],
      idea_reward_status: [
        "not_selected",
        "eligible",
        "approved",
        "reward_pending",
        "rewarded",
        "reward_failed",
      ],
      idea_status: [
        "draft",
        "submitted",
        "under_review",
        "needs_revision",
        "published",
        "selected",
        "in_development",
        "prototype",
        "playtest",
        "implemented",
        "archived",
      ],
    },
  },
} as const
