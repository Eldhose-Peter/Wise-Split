export class PriorityQueue<T> {
  private heap: { value: T; priority: number }[] = [];

  private parent(i: number) {
    return Math.floor((i - 1) / 2);
  }
  private left(i: number) {
    return 2 * i + 1;
  }
  private right(i: number) {
    return 2 * i + 2;
  }

  enqueue(value: T, priority: number) {
    this.heap.push({ value, priority });
    this.heapifyUp();
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const min = this.heap[0].value;
    const last = this.heap.pop();
    if (this.heap.length > 0 && last) {
      this.heap[0] = last;
      this.heapifyDown();
    }
    return min;
  }

  peek(): T | undefined {
    return this.heap[0]?.value;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private heapifyUp() {
    let i = this.heap.length - 1;
    while (
      i > 0 &&
      this.heap[this.parent(i)].priority > this.heap[i].priority
    ) {
      [this.heap[i], this.heap[this.parent(i)]] = [
        this.heap[this.parent(i)],
        this.heap[i],
      ];
      i = this.parent(i);
    }
  }

  private heapifyDown() {
    let i = 0;
    while (this.left(i) < this.heap.length) {
      let smallerChild = this.left(i);
      if (
        this.right(i) < this.heap.length &&
        this.heap[this.right(i)].priority < this.heap[smallerChild].priority
      ) {
        smallerChild = this.right(i);
      }

      if (this.heap[i].priority <= this.heap[smallerChild].priority) break;

      [this.heap[i], this.heap[smallerChild]] = [
        this.heap[smallerChild],
        this.heap[i],
      ];
      i = smallerChild;
    }
  }
}
