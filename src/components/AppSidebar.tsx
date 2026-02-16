import {
  LayoutDashboard,
  MessageCircleHeart,
  History,
  BarChart3,
  Heart,
  Users,
  LogOut,
  NotebookPen,
  Settings,
  ShieldAlert,
  Trophy,
  Sparkles
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "Talk to Sahaay", url: "/chat", icon: MessageCircleHeart },
  { title: "Chat History", url: "/chat/history", icon: History },
  { title: "Your Mood Journey", url: "/analytics", icon: BarChart3 },
  { title: "Ways to Feel Better", url: "/coping", icon: Heart },
  { title: "Community", url: "/community", icon: Users },
  { title: "Rewards", url: "/rewards", icon: Trophy },
  { title: "Journal", url: "/journal", icon: NotebookPen },
  { title: "Safety Plan", url: "/safety", icon: ShieldAlert },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { logOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
          <img src="/logo.png" alt="Sahaay AI logo" className="h-7 w-7 rounded-lg object-cover" />
        </div>
        {!collapsed && (
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Sahaay
          </span>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground transition-all hover:bg-surface-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      activeClassName="bg-primary/10 text-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenuButton asChild tooltip="Sign out">
          <button
            type="button"
            onClick={logOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
