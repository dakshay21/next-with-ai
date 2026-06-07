export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          handle: string;
          display_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          handle: string;
          display_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          handle?: string;
          display_name?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          url: string;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          url?: string;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];
