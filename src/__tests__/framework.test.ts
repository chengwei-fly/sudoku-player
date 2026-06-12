/**
 * 简单测试用例 - 验证测试框架工作正常
 */
import { describe, it, expect } from 'vitest'

describe('测试框架验证', () => {
  it('应该正确执行基本断言', () => {
    expect(1 + 1).toBe(2)
    expect('hello').toBe('hello')
    expect([1, 2, 3]).toHaveLength(3)
  })

  it('应该正确处理数组', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(arr).toContain(3)
    expect(arr.map(x => x * 2)).toEqual([2, 4, 6, 8, 10])
  })

  it('应该正确处理对象', () => {
    const obj = { name: 'test', value: 42 }
    expect(obj).toHaveProperty('name')
    expect(obj.name).toBe('test')
  })
})
