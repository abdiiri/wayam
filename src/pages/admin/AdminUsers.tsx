import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminUsers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-poppins font-bold">Manage Users</h1>
        <p className="text-muted-foreground">View users and manage roles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">User management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
