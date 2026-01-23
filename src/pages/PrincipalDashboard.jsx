import Layout from '../components/Layout';
import Card from '../components/Card';
import { Users, TrendingUp, Building, DollarSign } from 'lucide-react';

const PrincipalDashboard = () => {
  return (
    <Layout>
      <h1 className="section-title">Principal Dashboard</h1>

      <div className="dashboard-grid">
        <Card
          title="Total Students"
          value="980"
          description="Enrolled this semester"
          icon={Users}
        />
        <Card
          title="Faculty Members"
          value="65"
          description="Active teaching staff"
          icon={Users}
        />
        <Card
          title="Overall Performance"
          value="87%"
          description="Average student performance"
          icon={TrendingUp}
        />
        <Card
          title="Departments"
          value="12"
          description="Academic departments"
          icon={Building}
        />
      </div>

      <h2 className="section-title">Department Overview</h2>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Head</th>
              <th>Faculty</th>
              <th>Students</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Computer Science</td>
              <td>Dr. Robert Wilson</td>
              <td>12</td>
              <td>245</td>
              <td>89%</td>
            </tr>
            <tr>
              <td>Mathematics</td>
              <td>Dr. Linda Martinez</td>
              <td>8</td>
              <td>180</td>
              <td>85%</td>
            </tr>
            <tr>
              <td>Engineering</td>
              <td>Dr. James Anderson</td>
              <td>15</td>
              <td>320</td>
              <td>87%</td>
            </tr>
            <tr>
              <td>Business</td>
              <td>Prof. Patricia Taylor</td>
              <td>10</td>
              <td>235</td>
              <td>88%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default PrincipalDashboard;
