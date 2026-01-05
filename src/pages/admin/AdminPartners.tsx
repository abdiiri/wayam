import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPartners = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-poppins font-bold">Manage Partners</h1>
        <p className="text-muted-foreground">Manage partner airline logos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partners</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Partner management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPartners;
