
export class LineageNode {
  constructor(
    id,
    fullName,
    students
  ) {
    this.id = id;
    this.fullName = fullName;
    this.students = students;
  }
}

export class LineageTree {
  constructor(
    root
  ) {
    this.root = root;
    this._nodeMap = new Map();
    this._nodeMap.set(root.id, root);
  }

  setStudents(nodeId, students) {
    let node = this._nodeMap.get(nodeId);
    if (node) {
      node.students = students;
      students.forEach((student) => {
        this._nodeMap.set(student.id, student);
      });
    }
  }
}
