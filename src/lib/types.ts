import { z } from "zod";
import { Prisma, ProjectStatus, User } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { IDetectedBarcode, IScannerProps } from "@yudiel/react-qr-scanner";
import { Table as TanstackTable } from "@tanstack/react-table";
import { Column, Row, ColumnDef } from "@tanstack/react-table";
import { ReactNode } from "react";


export interface TimeSeriesData {
  date: string;
  value: number;
  [key: string]: string | number;
}

export interface DataPoint {
  [key: string]: string | number | boolean | null | undefined;
}

export interface Metric {
  label: string
  current: number
  goal: number
  unit: string
  color: string
}

export interface Metric2 {
  label: string
  value: number | string
  unit: string
}

export interface BarChartCardProps {
  title: string
  description?: string
  value: number | string
  unit: string
  data: DataPoint[]
  dataKey: string
  xAxisKey: string
  configLabel: string
  cardClassName?: string
  chartWidth?: string
  chartColor?: string
  valueFormatter?: (value: number | string) => string
}

export interface DataPoint2 {
  activity: string
  value: number
  label: string
  fill?: string
}

export interface AreaChartCardProps {
  description?: string
  value: string | number
  unit: string
  secondaryValue?: string | number
  secondaryUnit?: string
  data: DataPoint[]
  dataKey: string
  xAxisKey: string
  configLabel: string
  cardClassName?: string
  chartColor?: string
  valueFormatter?: (value: number | string) => string
  tooltipFormatter?: (value: string | number) => ReactNode
}
export interface Metric3 {
  label: string
  value: number | string
  unit: string
}

export interface VerticalBarChartCardProps {
  data: DataPoint2[]
  metrics: Metric3[]
  config: { [key: string]: { label: string; color: string } }
  cardClassName?: string
  chartHeight?: string
  barSize?: number
  barGap?: number
  valueFormatter?: (value: number | string) => string
}

export interface EnergyBarChartCardProps {
  title: string
  description?: string
  value: number | string
  unit: string
  data: DataPoint[]
  dataKey: string
  xAxisKey: string
  configLabel: string
  cardClassName?: string
  chartWidth?: string
  chartColor?: string
  valueFormatter?: (value: number | string) => string
}

export interface LineChartCardProps {
  metrics: Metric2[]
  data: DataPoint[]
  dataKey: string
  xAxisKey: string
  configLabel: string
  cardClassName?: string
  chartColor?: string
  valueFormatter?: (value: number | string) => string
  xAxisFormatter?: (value: string | number | Date) => string
  tooltipLabelFormatter?: (value: string | number | Date) => string
  showGrid?: boolean
}

export interface RadialProgressCardProps {

  metrics: Metric[]


  cardClassName?: string
  chartClassName?: string
  barSize?: number
  innerRadius?: string
  cornerRadius?: number


  valueFormatter?: (current: number, goal: number) => string
  showTextValues?: boolean
  textClassName?: string


  startAngle?: number
  endAngle?: number
  domain?: [number, number]
}
export interface ComparisonBarCardProps {

  title?: string;
  description?: string | ReactNode;


  data: [DataPoint, DataPoint];
  valueKey: string;
  labelKey: string;


  valueFormatter?: (value: number) => string;
  unit?: string;


  cardClassName?: string;
  barHeight?: number;
  barRadius?: number;
  primaryColor?: string;
  secondaryColor?: string;
  labelFontSize?: number;

  configLabel: string;
  showValues?: boolean;
  valueClassName?: string;
}

export interface ChartCardProps {

  title: string | number;
  unit?: string;
  description?: string;
  titleClassName?: string;


  data: DataPoint[];
  dataKey: string;
  xAxisKey: string;
  configLabel: string;
  chartColor?: string;
  averageValue?: number;
  averageLabel?: string;


  valueFormatter?: (value: number) => string;
  xAxisFormatter?: (value: string | number | Date) => string;
  tooltipLabelFormatter?: (value: string | number | Date) => string;


  footerContent?: ReactNode;
  showFooter?: boolean;


  cardClassName?: string;
  barRadius?: number;
  showTooltip?: boolean;
  showReferenceLine?: boolean;


  calculateTotal?: (data: DataPoint[]) => number;
  calculateTarget?: (data: DataPoint[], current: number | string) => number;
}

export const AccountDetailsFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name must be less than 100 characters"),
});

export const NewDetailsFormSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional().or(z.literal("")),
});

export const AvatarFormSchema = z.object({
  avatar: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB").refine(
    (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
    "Only JPEG, PNG, or GIF files are allowed"
  ).optional(),
});

export const PasswordFormSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords must match",
  path: ["confirm"],
});


export const ProjectFormSchema = z.object({
  username: z.string().min(1, "Please select a project"),
});


export interface DataTableBodyProps<TData = User> {
  table: TanstackTable<TData>;
}

export interface DataTableFacetedFilterProps<TData = User, TValue = unknown> {
  column: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export interface DataTableProps<TData = User, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey?: string;
  filterOptions?: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  className?: string;
}
export interface DataTableToolbarProps<TData = User> {
  table: TanstackTable<TData>;
  filterKey?: string;
  filterOptions?: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[];
}
export interface DataTableRowActionsProps {
  row: Row<User>;
}
export interface UserColumnsProps {
  customFields?: Record<string, CustomField>;
}

export interface DataTablePaginationProps<TData = User> {
  table: TanstackTable<TData>;
}
export interface DataTableHeaderProps<TData = User> {
  table: TanstackTable<TData>;
}
export interface QRScannerToggleProps extends Omit<IScannerProps, "onScan"> {
  onScan: (detectedCodes: IDetectedBarcode[]) => Promise<void>;
}
export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

interface Project {
  id: string;
  name: string;
  username: string;
}

export interface ProjectSelectorProps {
  projects: Project[];
}

export type AccountDetailsFormValues = z.infer<typeof AccountDetailsFormSchema>;
export type NewDetailsFormValues = z.infer<typeof NewDetailsFormSchema>;
export type AvatarFormValues = z.infer<typeof AvatarFormSchema>;
export type PasswordFormValues = z.infer<typeof PasswordFormSchema>;

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface ProjectStats {
  totalProjects: number;
  publicProjects: number;
  privateProjects: number;
  unlistedProjects: number;
  avgUsersPerProject: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByProject: {
    projectId: string;
    projectName: string;
    userCount: number;
  }[];
}


export interface Business {
  id: string;
  email: string;
}
export interface ProjectListItem {
  name: string;
  description: string;
  username: string;
  status: ProjectStatus;
}
export type CustomField = {
  type: "text" | "textarea";
  defaultValue: string;
};
export interface Admin {
  id: string;
  email: string;
}

export type CustomFieldsType = Record<string, { type: string; defaultValue: string }>;
export interface ProjectStats {
  totalProjects: number;
  publicProjects: number;
  privateProjects: number;
  unlistedProjects: number;
  avgUsersPerProject: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByProject: { projectId: string; projectName: string; userCount: number }[];
}

export interface SystemStats {
  totalBusinesses: number;
  totalProjects: number;
  totalUsers: number;
  avgProjectsPerBusiness: number;
  avgUsersPerBusiness: number;
}

export type EnvSchemaType = {

  NEXT_PUBLIC_APP_URL: string;
};


export type LoginFormProps = {
  onSubmit: (values: z.infer<typeof loginformSchema>) => void;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  forgot?: React.ReactNode;
  isLoading?: boolean;
};


export type ForgotFormProps = {
  back?: React.ReactNode;
};


export type ResetFormProps = {
  back?: React.ReactNode;
};




export type ProjectTypes = {
  status: ProjectStatus;
  name: string;
  id: string;
  businessId: string;
  username: string;
  description: string;
  customFields: JsonValue | null;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
};


export type ProjectCardProps = {
  name: string;
  link: string;
  description: string;
};


export type ProjectWithUsers = Prisma.ProjectGetPayload<{
  include: { users: true };
}>;

export type ProjectListProps = {
  name: string;
  description: string;
  link: string;
};


export type ProjectCreateInput = {
  name: string;
  description: string;
  username: string;
  status: ProjectStatus;
};



export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  customFields?: Record<string, unknown>;
  apiKey?: string;
};



export type UserData = {
  id: string;
  projectId: string;
  status: string;
  data: {
    name?: string;
    email?: string;
    notes?: string;
    thing?: string;
    reason?: string;
    address?: string;
    phoneNumber?: string;
    [key: string]: string | undefined;
  };
  createdAt: string;
  updatedAt?: string;
};




export const createProjectSchema = z.object({
  fullname: z.string().min(3, {
    message: "Project Name must be at least 3 characters long.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long.",
  }),
  username: z
    .string()
    .min(1, { message: "Username (URL slug) is required." })
    .regex(/^[a-z0-9-_]+$/, {
      message:
        "Username must only contain lowercase letters, numbers, hyphens, or underscores (no spaces or special characters).",
    })
    .transform((val) => val.toLowerCase()),
});

export const signUpFormSchema = z.object({
  fullname: z.string().min(5, {
    message: "Company name must be at least 5 characters long.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  confirm: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});


export const forgotPasswordFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});


export const ResetPasswordFormSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
  confirm: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

export const loginformSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

export const projectfulllnameAndDescriptionUpdateFormSchema = z.object({
  fullname: z.string().min(3, {
    message: "Project Name must be at least 3 characters long.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long.",
  }),
});


export const projectStatusUpdateFormSchema = z.object({
  status: z.nativeEnum(ProjectStatus),
});


export const projectCustomFieldsUpdateFormSchema = z.object({
  customFields: z.record(z.unknown()),
});

export const customFieldTemplateSchema = z.object({
  fieldName: z.string().min(1, "Field name is required"),
  fieldType: z.enum(["text", "textarea"], {
    required_error: "Please select a field type",
  }),
});


export type CustomFieldTemplate = Record<
  string,
  { type: "text" | "textarea"; defaultValue: string }
>;

export interface LogoProps extends React.ComponentProps<"svg"> {
  mode?: "light" | "dark"; // Optional prop to specify the mode
}