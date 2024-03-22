import exp from "node:constants";

export const users = [
   /*
    {
      id: 8568,
      name: 'Firstytfyt Test',
      role: 'CEO',
      description:'Default Capture File, loads example data.',
      classification:'Custom',
      subclassification:'CustomSubClass',
      team: 'Management',
      status: 'active',
      age: '29',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      demodulation: 'wfm',
      email: 'tony.reichert@example.com',
      creationTime:1708914289040,
   },

    */

]

export const columns = [
   {name: "ID", uid: "id", sortable: true},
   {name: "NAME", uid: "name", sortable: true},
   {name: "AGE", uid: "age", sortable: true},
   {name: "ROLE", uid: "role", sortable: true},
   {name: "TEAM", uid: "team"},
   {name: "EMAIL", uid: "email"},
   {name: "STATUS", uid: "status", sortable: true},
   {name: "ACTIONS", uid: "actions"},

];

export const columns_minimized =[
   {name: 'NAME', uid: 'name'},
   //{name: 'ROLE', uid: 'role'},
   {name: 'CLASSIFICATION', uid: 'classification'},
   {name: 'FREQUENCY', uid: 'frequency'},
   //{name: 'DEMODULATION', uid: 'demodulation'},
   {name: 'DESCRIPTION', uid: 'description'},
   {name: 'STATUS', uid: 'status'},
   {name: 'ACTIONS', uid: 'actions'},
];

export const statusOptions = [
   {name: "Active", uid: "active"},
   {name: "Paused", uid: "paused"},
   {name: "Vacation", uid: "vacation"},
];
