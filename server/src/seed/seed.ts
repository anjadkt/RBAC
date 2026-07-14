// seed/seed.ts
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Module from '../modules/module/module.model';
import Operation from '../modules/operation/operation.modal';
import Permission from '../modules/permission/permission.model';
import Role from '../modules/role/role.model';
import User from '../modules/auth/user.model';


async function seed() {
    await mongoose.connect(process.env.MONGO_URI!);
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
    const userMod = await Module.create({ name: 'User Management', code: 'user' });

    // 2. Operations
    const view = await Operation.create({ name: 'View', code: 'view' });
    const create = await Operation.create({ name: 'Create', code: 'create' });
    const update = await Operation.create({ name: 'Update', code: 'update' });
    const approve = await Operation.create({ name: 'Approve', code: 'approve' });
    const assignPermission = await Operation.create({ name: 'Assign Permission', code: 'assignPermission' });
    const assignRole = await Operation.create({ name: 'Assign Role', code: 'assignRole' });

    // 3. Permissions — helper to reduce repetition
    const makePerm = async (mod: any, op: any) => {
        const code = `${mod.code}.${op.code}`;
        return Permission.create({ module: mod._id, operation: op._id, code });
    };

    const empView = await makePerm(employeeMod, view);
    const empCreate = await makePerm(employeeMod, create);
    const empUpdate = await makePerm(employeeMod, update);
    const attView = await makePerm(attendanceMod, view);
    const attApprove = await makePerm(attendanceMod, approve);
    const leaveView = await makePerm(leaveMod, view);
    const leaveCreate = await makePerm(leaveMod, create);
    const leaveApprove = await makePerm(leaveMod, approve);

    const rbacModuleView = await makePerm(rbacModuleMod, view);
    const rbacModuleCreate = await makePerm(rbacModuleMod, create);
    const rbacModuleUpdate = await makePerm(rbacModuleMod, update);
    const rbacOperationView = await makePerm(rbacOperationMod, view);
    const rbacOperationCreate = await makePerm(rbacOperationMod, create);
    const rbacPermissionView = await makePerm(rbacPermissionMod, view);
    const rbacPermissionCreate = await makePerm(rbacPermissionMod, create);
    const rbacRoleView = await makePerm(rbacRoleMod, view);
    const rbacRoleCreate = await makePerm(rbacRoleMod, create);
    const rbacRoleAssignPermission = await makePerm(rbacRoleMod, assignPermission);
    const userView = await makePerm(userMod, view);
    const userCreate = await makePerm(userMod, create);
    const userUpdate = await makePerm(userMod, update);
    const userAssignRole = await makePerm(userMod, assignRole);

    // 4. Roles
    const superAdminRole = await Role.create({
        name: 'Super Administrator',
        level: 0,
        permissions: [
            rbacModuleView._id, rbacModuleCreate._id, rbacModuleUpdate._id,
            rbacOperationView._id, rbacOperationCreate._id,
            rbacPermissionView._id, rbacPermissionCreate._id,
            rbacRoleView._id, rbacRoleCreate._id, rbacRoleAssignPermission._id,
            userView._id, userCreate._id, userUpdate._id, userAssignRole._id,
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
        permissions: [leaveView._id, leaveCreate._id],
    });

    // 5. Demo users
    const password = await bcrypt.hash('password@123', 10);

    await User.create({ name: 'Super Admin', email: 'admin@example.com', password, role: superAdminRole._id });
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