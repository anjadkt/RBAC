// seed/seed.ts
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Module from '../modules/module/module.model';
import Operation from '../modules/operation/operation.modal';
import Permission from '../modules/permission/permission.model';
import Role from '../modules/role/role.model';
import User from '../modules/auth/user.model';
import env from '../config/env';


async function seed() {
    await mongoose.connect(env.MONGO_URL!);

    console.log('Connected. Clearing existing data...');

    await Promise.all([
        Module.deleteMany({}), Operation.deleteMany({}), Permission.deleteMany({}),
        Role.deleteMany({}), User.deleteMany({}),
    ]);

    // 1. Modules (business + rbac-management)
    const employeeMod = await Module.create({ name: 'Employee Management', code: 'employee' });
    const attendanceMod = await Module.create({ name: 'Attendance', code: 'attendance' });
    const leaveMod = await Module.create({ name: 'Leave Management', code: 'leave' });
    const rbacModuleMod = await Module.create({ name: 'Module Management', code: 'rbac.module' });
    const rbacOperationMod = await Module.create({ name: 'Operation Management', code: 'rbac.operation' });
    const rbacPermissionMod = await Module.create({ name: 'Permission Management', code: 'rbac.permission' });
    const rbacRoleMod = await Module.create({ name: 'Role Management', code: 'rbac.role' });
    const userMod = await Module.create({ name: 'User Management', code: 'users' });

    // 2. Operations
    const view = await Operation.create({ name: 'View', code: 'view' });
    const create = await Operation.create({ name: 'Create', code: 'create' });
    const update = await Operation.create({ name: 'Update', code: 'update' });
    const approve = await Operation.create({ name: 'Approve', code: 'approve' });
    const change = await Operation.create({ name: 'Change', code: 'change' });
    const assignRole = await Operation.create({ name: 'Assign Role', code: 'assignRole' });

    // 3. Permissions — helper to reduce repetition
    const makePerm = async (mod: any, op: any, label: string, description: string) => {
        const code = `${mod.code}.${op.code}`;
        return Permission.create({ module: mod._id, operation: op._id, code, label, description });
    };

    const empView = await makePerm(employeeMod, view, 'View Employees', 'Allows viewing the list and details of employee records');
    const empCreate = await makePerm(employeeMod, create, 'Create Employee', 'Allows adding new employee records to the system');
    const empUpdate = await makePerm(employeeMod, update, 'Update Employee', 'Allows editing existing employee details');

    const attView = await makePerm(attendanceMod, view, 'View Attendance', 'Allows viewing attendance records');
    const attApprove = await makePerm(attendanceMod, approve, 'Approve Attendance', 'Allows approving submitted attendance entries');

    const leaveView = await makePerm(leaveMod, view, 'View Leave', 'Allows viewing leave requests');
    const leaveCreate = await makePerm(leaveMod, create, 'Apply Leave', 'Allows submitting a new leave request');
    const leaveApprove = await makePerm(leaveMod, approve, 'Approve Leave', 'Allows approving or rejecting leave requests');

    const rbacModuleView = await makePerm(rbacModuleMod, view, 'View Modules', 'Allows viewing the list of business modules');
    const rbacModuleCreate = await makePerm(rbacModuleMod, create, 'Create Module', 'Allows creating new business modules');
    const rbacModuleUpdate = await makePerm(rbacModuleMod, update, 'Update Module', 'Allows editing or disabling existing modules');

    const rbacOperationView = await makePerm(rbacOperationMod, view, 'View Operations', 'Allows viewing the list of operations');
    const rbacOperationCreate = await makePerm(rbacOperationMod, create, 'Create Operation', 'Allows creating new operations (e.g. view, approve, export)');

    const rbacPermissionView = await makePerm(rbacPermissionMod, view, 'View Permissions', 'Allows viewing all system permissions');
    const rbacPermissionCreate = await makePerm(rbacPermissionMod, create, 'Create Permission', 'Allows generating new permissions from module + operation pairs');

    const rbacRoleView = await makePerm(rbacRoleMod, view, 'View Roles', 'Allows viewing the list of roles and their assigned permissions');
    const rbacRoleCreate = await makePerm(rbacRoleMod, create, 'Create Role', 'Allows creating new roles');
    const rbacRoleUpdate = await makePerm(rbacRoleMod, update, 'Update Role', 'Allows editing role details or toggling role status');

    const userView = await makePerm(userMod, view, 'View Users', 'Allows viewing the list of system users');
    const userCreate = await makePerm(userMod, create, 'Create User', 'Allows creating new user accounts');
    const userUpdate = await makePerm(userMod, update, 'Update User', 'Allows editing existing user details');
    const userChange = await makePerm(userMod, change, 'Change User Status', 'Allows enabling or disabling a user account');
    const userAssignRole = await makePerm(userMod, assignRole, 'Assign Role', 'Allows assigning or revoking roles for a user');

    // 4. Roles
    const superAdminRole = await Role.create({
        name: 'Super Administrator',
        level: 0,
        permissions: [
            rbacModuleView._id, rbacModuleCreate._id, rbacModuleUpdate._id,
            rbacOperationView._id, rbacOperationCreate._id,
            rbacPermissionView._id, rbacPermissionCreate._id,
            rbacRoleView._id, rbacRoleCreate._id, rbacRoleUpdate._id,
            userView._id, userCreate._id, userUpdate._id, userAssignRole._id, userChange._id,
            empView._id, empCreate._id, empUpdate._id,
            attView._id, attApprove._id,
            leaveView._id, leaveCreate._id, leaveApprove._id,
        ],
    });

    const hrRole = await Role.create({
        name: 'HR Manager',
        level: 10,
        permissions: [empView._id, empCreate._id, empUpdate._id, attView._id, leaveView._id, leaveApprove._id],
    });

    const employeeRole = await Role.create({
        name: 'Employee',
        level: 50,
        permissions: [userView._id, userUpdate._id, leaveView._id, leaveCreate._id],
    });

    // 5. Demo users
    const password = await bcrypt.hash('password@123', 10);

    await User.create({ name: 'Super Admin', email: 'admin@example.com', password, role: superAdminRole._id, isSuperAdmin: true });
    await User.create({ name: 'HR User', email: 'hr@example.com', password, role: hrRole._id });
    await User.create({ name: 'Employee User', email: 'employee@example.com', password, role: employeeRole._id });

    console.log('Seed complete.');
    console.log('Demo credentials:');
    console.log('  Super Admin: admin@example.com / password@123');
    console.log('  HR Manager:  hr@example.com / password@123');
    console.log('  Employee:    employee@example.com / password@123');

    await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });