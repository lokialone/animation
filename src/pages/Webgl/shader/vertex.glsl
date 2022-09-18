void main() {
    // vec3 newPosition = vec3(position.x, position.y, position.z);
    // newPosition.z = newPosition.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}