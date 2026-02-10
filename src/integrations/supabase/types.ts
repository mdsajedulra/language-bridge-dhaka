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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admission_applications: {
        Row: {
          additional_notes: string | null
          address: string | null
          course_id: string | null
          created_at: string
          date_of_birth: string | null
          education_level: string | null
          email: string
          full_name: string
          how_did_you_hear: string | null
          id: string
          phone: string
          preferred_schedule: string | null
          status: string | null
        }
        Insert: {
          additional_notes?: string | null
          address?: string | null
          course_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          education_level?: string | null
          email: string
          full_name: string
          how_did_you_hear?: string | null
          id?: string
          phone: string
          preferred_schedule?: string | null
          status?: string | null
        }
        Update: {
          additional_notes?: string | null
          address?: string | null
          course_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          education_level?: string | null
          email?: string
          full_name?: string
          how_did_you_hear?: string | null
          id?: string
          phone?: string
          preferred_schedule?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admission_applications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      alumni: {
        Row: {
          address: string | null
          batch_year: number | null
          company: string | null
          created_at: string
          current_position_bn: string | null
          current_position_en: string | null
          current_position_zh: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          phone: string | null
          photo_url: string | null
          story_bn: string | null
          story_en: string | null
          story_zh: string | null
        }
        Insert: {
          address?: string | null
          batch_year?: number | null
          company?: string | null
          created_at?: string
          current_position_bn?: string | null
          current_position_en?: string | null
          current_position_zh?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          phone?: string | null
          photo_url?: string | null
          story_bn?: string | null
          story_en?: string | null
          story_zh?: string | null
        }
        Update: {
          address?: string | null
          batch_year?: number | null
          company?: string | null
          created_at?: string
          current_position_bn?: string | null
          current_position_en?: string | null
          current_position_zh?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          story_bn?: string | null
          story_en?: string | null
          story_zh?: string | null
        }
        Relationships: []
      }
      books: {
        Row: {
          author: string | null
          cover_image_url: string | null
          created_at: string
          description_bn: string | null
          description_en: string | null
          description_zh: string | null
          id: string
          is_active: boolean | null
          price: number | null
          sort_order: number | null
          title_bn: string
          title_en: string
          title_zh: string
        }
        Insert: {
          author?: string | null
          cover_image_url?: string | null
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          sort_order?: number | null
          title_bn: string
          title_en: string
          title_zh: string
        }
        Update: {
          author?: string | null
          cover_image_url?: string | null
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          is_active?: boolean | null
          price?: number | null
          sort_order?: number | null
          title_bn?: string
          title_en?: string
          title_zh?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          created_at: string
          description_bn: string | null
          description_en: string | null
          description_zh: string | null
          duration_bn: string | null
          duration_en: string | null
          duration_zh: string | null
          features_bn: string[] | null
          features_en: string[] | null
          features_zh: string[] | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          price: number | null
          sort_order: number | null
          title_bn: string
          title_en: string
          title_zh: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          duration_bn?: string | null
          duration_en?: string | null
          duration_zh?: string | null
          features_bn?: string[] | null
          features_en?: string[] | null
          features_zh?: string[] | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          price?: number | null
          sort_order?: number | null
          title_bn: string
          title_en: string
          title_zh: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          duration_bn?: string | null
          duration_en?: string | null
          duration_zh?: string | null
          features_bn?: string[] | null
          features_en?: string[] | null
          features_zh?: string[] | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          price?: number | null
          sort_order?: number | null
          title_bn?: string
          title_en?: string
          title_zh?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: string | null
          created_at: string
          id: string
          image_url: string
          is_active: boolean | null
          sort_order: number | null
          title_bn: string | null
          title_en: string | null
          title_zh: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_active?: boolean | null
          sort_order?: number | null
          title_bn?: string | null
          title_en?: string | null
          title_zh?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
          sort_order?: number | null
          title_bn?: string | null
          title_en?: string | null
          title_zh?: string | null
        }
        Relationships: []
      }
      hero_settings: {
        Row: {
          background_image_url: string | null
          badge_text: string | null
          id: string
          stat_students: string | null
          stat_teachers: string | null
          stat_years: string | null
          subtitle_bn: string
          subtitle_en: string
          subtitle_zh: string
          tagline_bn: string
          tagline_en: string
          tagline_zh: string
          updated_at: string
        }
        Insert: {
          background_image_url?: string | null
          badge_text?: string | null
          id?: string
          stat_students?: string | null
          stat_teachers?: string | null
          stat_years?: string | null
          subtitle_bn: string
          subtitle_en: string
          subtitle_zh: string
          tagline_bn: string
          tagline_en: string
          tagline_zh: string
          updated_at?: string
        }
        Update: {
          background_image_url?: string | null
          badge_text?: string | null
          id?: string
          stat_students?: string | null
          stat_teachers?: string | null
          stat_years?: string | null
          subtitle_bn?: string
          subtitle_en?: string
          subtitle_zh?: string
          tagline_bn?: string
          tagline_en?: string
          tagline_zh?: string
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          created_at: string
          deadline: string | null
          description_bn: string | null
          description_en: string | null
          description_zh: string | null
          id: string
          is_active: boolean | null
          job_type: string | null
          location_bn: string | null
          location_en: string | null
          location_zh: string | null
          salary_range: string | null
          title_bn: string
          title_en: string
          title_zh: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location_bn?: string | null
          location_en?: string | null
          location_zh?: string | null
          salary_range?: string | null
          title_bn: string
          title_en: string
          title_zh: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location_bn?: string | null
          location_en?: string | null
          location_zh?: string | null
          salary_range?: string | null
          title_bn?: string
          title_en?: string
          title_zh?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          content_bn: string | null
          content_en: string | null
          content_zh: string | null
          created_at: string
          external_url: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          published_at: string | null
          source: string | null
          title_bn: string
          title_en: string
          title_zh: string
        }
        Insert: {
          content_bn?: string | null
          content_en?: string | null
          content_zh?: string | null
          created_at?: string
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          published_at?: string | null
          source?: string | null
          title_bn: string
          title_en: string
          title_zh: string
        }
        Update: {
          content_bn?: string | null
          content_en?: string | null
          content_zh?: string | null
          created_at?: string
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          published_at?: string | null
          source?: string | null
          title_bn?: string
          title_en?: string
          title_zh?: string
        }
        Relationships: []
      }
      nav_items: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          label_bn: string
          label_en: string
          label_zh: string
          path: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          label_bn: string
          label_en: string
          label_zh: string
          path: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          label_bn?: string
          label_en?: string
          label_zh?: string
          path?: string
          sort_order?: number
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: []
      }
      notices: {
        Row: {
          category: string | null
          content_bn: string | null
          content_en: string | null
          content_zh: string | null
          created_at: string
          id: string
          is_active: boolean | null
          is_pinned: boolean | null
          published_at: string | null
          title_bn: string
          title_en: string
          title_zh: string
        }
        Insert: {
          category?: string | null
          content_bn?: string | null
          content_en?: string | null
          content_zh?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_pinned?: boolean | null
          published_at?: string | null
          title_bn: string
          title_en: string
          title_zh: string
        }
        Update: {
          category?: string | null
          content_bn?: string | null
          content_en?: string | null
          content_zh?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_pinned?: boolean | null
          published_at?: string | null
          title_bn?: string
          title_en?: string
          title_zh?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          created_at: string
          description_bn: string | null
          description_en: string | null
          description_zh: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          sort_order: number | null
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          sort_order?: number | null
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          sort_order?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description_bn: string | null
          description_en: string | null
          description_zh: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          sort_order: number | null
          title_bn: string
          title_en: string
          title_zh: string
        }
        Insert: {
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title_bn: string
          title_en: string
          title_zh: string
        }
        Update: {
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          title_bn?: string
          title_en?: string
          title_zh?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          image_url: string | null
          key: string
          updated_at: string
          value_bn: string | null
          value_en: string | null
          value_zh: string | null
        }
        Insert: {
          id?: string
          image_url?: string | null
          key: string
          updated_at?: string
          value_bn?: string | null
          value_en?: string | null
          value_zh?: string | null
        }
        Update: {
          id?: string
          image_url?: string | null
          key?: string
          updated_at?: string
          value_bn?: string | null
          value_en?: string | null
          value_zh?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          bio_bn: string | null
          bio_en: string | null
          bio_zh: string | null
          created_at: string
          designation_bn: string | null
          designation_en: string | null
          designation_zh: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          phone: string | null
          photo_url: string | null
          sort_order: number | null
          specialization_bn: string | null
          specialization_en: string | null
          specialization_zh: string | null
        }
        Insert: {
          bio_bn?: string | null
          bio_en?: string | null
          bio_zh?: string | null
          created_at?: string
          designation_bn?: string | null
          designation_en?: string | null
          designation_zh?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          phone?: string | null
          photo_url?: string | null
          sort_order?: number | null
          specialization_bn?: string | null
          specialization_en?: string | null
          specialization_zh?: string | null
        }
        Update: {
          bio_bn?: string | null
          bio_en?: string | null
          bio_zh?: string | null
          created_at?: string
          designation_bn?: string | null
          designation_en?: string | null
          designation_zh?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          sort_order?: number | null
          specialization_bn?: string | null
          specialization_en?: string | null
          specialization_zh?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          content_bn: string
          content_en: string
          content_zh: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          rating: number | null
          role_bn: string | null
          role_en: string | null
          role_zh: string | null
          sort_order: number | null
        }
        Insert: {
          avatar_url?: string | null
          content_bn: string
          content_en: string
          content_zh: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          rating?: number | null
          role_bn?: string | null
          role_en?: string | null
          role_zh?: string | null
          sort_order?: number | null
        }
        Update: {
          avatar_url?: string | null
          content_bn?: string
          content_en?: string
          content_zh?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          rating?: number | null
          role_bn?: string | null
          role_en?: string | null
          role_zh?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          category: string | null
          id: string
          key: string
          updated_at: string
          value_bn: string
          value_en: string
          value_zh: string
        }
        Insert: {
          category?: string | null
          id?: string
          key: string
          updated_at?: string
          value_bn: string
          value_en: string
          value_zh: string
        }
        Update: {
          category?: string | null
          id?: string
          key?: string
          updated_at?: string
          value_bn?: string
          value_en?: string
          value_zh?: string
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
      videos: {
        Row: {
          category: string | null
          created_at: string
          description_bn: string | null
          description_en: string | null
          description_zh: string | null
          id: string
          is_active: boolean | null
          sort_order: number | null
          thumbnail_url: string | null
          title_bn: string
          title_en: string
          title_zh: string
          video_url: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title_bn: string
          title_en: string
          title_zh: string
          video_url: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          description_zh?: string | null
          id?: string
          is_active?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title_bn?: string
          title_en?: string
          title_zh?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
