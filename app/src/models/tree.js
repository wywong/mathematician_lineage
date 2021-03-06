
export class LineageNode {
  constructor(
    id,
    fullName,
    image_url,
    wiki_url,
    students
  ) {
    this.id = id;
    this.fullName = fullName;
    this.image_url = image_url;
    this.wiki_url = wiki_url;
    this.students = students;
  }

  get children() {
    return this.students;
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
      students.forEach((student) => {
        if (!this._nodeMap.get(student.id)) {
          this._nodeMap.set(student.id, student);
          node.students.push(student);
        }
      });
    }
  }
}
